'use strict';

// Copy this file into another family app. It verifies the family_session
// cookie set by auth.thephillips.family. Node 20+. No dependencies.
//
// Apps should verify tokens, not mint them. signToken exists so the auth
// server and this file share one implementation.

const crypto = require('crypto');

const COOKIE_NAME = 'family_session';
const ISSUER = 'auth.thephillips.family';
const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{0,31}$/;
const DEFAULT_SKEW_SECONDS = 30;
const DEFAULT_MAX_TTL_SECONDS = 60 * 60 * 24 * 90;

function assertSecret(secret) {
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
}

function signToken(payload, secret) {
  assertSecret(secret);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token, secret, options = {}) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 4096) return null;
  if (typeof secret !== 'string' || secret.length < 32) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sigB64] = parts;
  if (!headerB64 || !bodyB64 || !sigB64) return null;

  let header;
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!header || header.alg !== 'HS256' || header.typ !== 'JWT') return null;

  const expected = crypto.createHmac('sha256', secret).update(`${headerB64}.${bodyB64}`).digest();
  let actual;
  try {
    actual = Buffer.from(sigB64, 'base64url');
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (typeof payload.sub !== 'string' || !USERNAME_RE.test(payload.sub)) return null;
  if (typeof payload.iat !== 'number' || typeof payload.exp !== 'number') return null;
  if (!Number.isFinite(payload.iat) || !Number.isFinite(payload.exp)) return null;
  if (payload.exp <= payload.iat) return null;
  if (payload.v !== undefined && payload.v !== 1) return null;

  const issuer = options.issuer === undefined ? ISSUER : options.issuer;
  if (issuer && payload.iss !== issuer) return null;
  if (Array.isArray(options.users) && !options.users.includes(payload.sub)) return null;

  const epoch = Number.isInteger(payload.ep) && payload.ep >= 0 ? payload.ep : 0;
  if (options.minEpoch != null && epoch < options.minEpoch) return null;

  const maxTtl = options.maxTtlSeconds ?? DEFAULT_MAX_TTL_SECONDS;
  if (payload.exp - payload.iat > maxTtl) return null;

  const now = options.now ?? Math.floor(Date.now() / 1000);
  const skew = options.clockSkewSeconds ?? DEFAULT_SKEW_SECONDS;
  if (payload.exp < now - skew) return null;
  if (payload.iat > now + skew) return null;

  const session = { sub: payload.sub, iat: payload.iat, exp: payload.exp, iss: payload.iss, v: payload.v };
  if (Number.isInteger(payload.ep) && payload.ep >= 0 && payload.ep < 1_000_000) session.ep = payload.ep;
  if (typeof payload.sid === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(payload.sid)) session.sid = payload.sid;
  return session;
}

function parseCookies(header) {
  const out = Object.create(null);
  if (!header || typeof header !== 'string') return out;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (!key || Object.prototype.hasOwnProperty.call(out, key)) continue;
    out[key] = part.slice(eq + 1).trim();
  }
  return out;
}

function sessionFromCookieHeader(cookieHeader, secret, options = {}) {
  const cookies = parseCookies(cookieHeader);
  const name = options.cookieName || COOKIE_NAME;
  const token = cookies[name];
  if (!token) return null;
  return verifyToken(token, secret, options);
}

function readFamilyUser(req, secret, options = {}) {
  const payload = sessionFromCookieHeader(req.headers && req.headers.cookie, secret, options);
  if (!payload) return null;
  const user = { username: payload.sub, exp: payload.exp, iat: payload.iat };
  if (payload.sid) user.sid = payload.sid;
  if (payload.ep != null) user.ep = payload.ep;
  return user;
}

function familySession(options = {}) {
  assertSecret(options.secret);
  const authUrl = String(options.authUrl || 'https://auth.thephillips.family').replace(/\/$/, '');
  const cookieName = options.cookieName || COOKIE_NAME;
  const mode = options.mode === 'json' ? 'json' : 'redirect';

  return function familySessionMiddleware(req, res, nextFn) {
    const user = readFamilyUser(req, options.secret, {
      cookieName,
      issuer: options.issuer,
      users: options.users,
      minEpoch: options.minEpoch,
    });
    if (user) {
      req.family = user;
      nextFn();
      return;
    }
    if (mode === 'json') {
      res.status(401).json({ authenticated: false });
      return;
    }

    const host = req.get ? req.get('host') : '';
    const dest = `${req.protocol}://${host}${req.originalUrl || '/'}`;
    if (!host || /[\r\n]/.test(dest) || dest.length > 2000) {
      res.status(401).type('text/plain').send('Sign in required');
      return;
    }
    res.redirect(302, `${authUrl}/?next=${encodeURIComponent(dest)}`);
  };
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

module.exports = {
  COOKIE_NAME,
  ISSUER,
  USERNAME_RE,
  signToken,
  verifyToken,
  parseCookies,
  sessionFromCookieHeader,
  readFamilyUser,
  familySession,
};
