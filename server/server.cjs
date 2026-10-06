'use strict';

/* scoreboard behind family login. Serves Vite dist/; process exists for the gate.
 * Never mints a session — auth.thephillips.family writes family_session. */

const path = require('path');
const express = require('express');
const { familySession } = require('./session.cjs');

const PORT = Number(process.env.PORT) || 5000;
const SECRET = process.env.SESSION_SECRET || '';
const AUTH_URL = process.env.AUTH_URL || 'https://auth.thephillips.family';
const USERS = (process.env.FAMILY_USERS || 'danny,hillary')
  .split(',').map((s) => s.trim()).filter(Boolean);

const WEB = path.join(__dirname, '..', 'dist');

function createApp(secret = SECRET) {
  if (secret.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');

  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.get('/health', (_req, res) => res.json({ ok: true, service: 'scoreboard' }));
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /\n');
  });
  app.use((_req, res, next) => {
    res.set('X-Robots-Tag', 'noindex, nofollow');
    next();
  });

  app.use(familySession({ secret, authUrl: AUTH_URL, users: USERS }));

  app.use(express.static(WEB, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.set('Cache-Control', 'no-cache');
      }
    },
  }));

  app.get(['/', '/index.html'], (_req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(WEB, 'index.html'));
  });

  app.use((req, res) => {
    if (req.method === 'GET' && !path.extname(req.path)) {
      res.set('Cache-Control', 'no-cache');
      return res.sendFile(path.join(WEB, 'index.html'));
    }
    res.status(404).type('text/plain').send('Not found');
  });

  return app;
}

if (require.main === module) {
  let app;
  try {
    app = createApp();
  } catch (err) {
    console.error(`${err.message} — refusing to start.`);
    process.exit(1);
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`scoreboard on :${PORT}, auth at ${AUTH_URL}`));
}

module.exports = { createApp };
