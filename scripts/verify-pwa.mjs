import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const swSource = fs.readFileSync(new URL('public/sw.js', root), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('public/manifest.json', root), 'utf8'));
const indexHtml = fs.readFileSync(new URL('index.html', root), 'utf8');
const css = fs.readFileSync(new URL('src/index.css', root), 'utf8');

function pngSize(fileUrl) {
  const buf = fs.readFileSync(fileUrl);
  assert.equal(buf.readUInt32BE(0), 0x89504e47, `${fileUrl} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const listeners = {};
const context = {
  self: {
    addEventListener(type, fn) {
      (listeners[type] ||= []).push(fn);
    },
    location: new URL('https://scoreboard.thephillips.family/sw.js'),
  },
  caches: {},
  fetch: () => {
    throw new Error('unexpected fetch');
  },
  URL,
  Request,
  Response,
  Headers,
  Promise,
  console,
};
vm.createContext(context);
vm.runInContext(swSource, context);
const policy = context.self.__scoreboardSw;

function page(url, mode = 'cors', method = 'GET') {
  // Node's Request constructor rejects mode "navigate"; the worker only reads these fields.
  if (mode === 'navigate') return { url, mode, method };
  return new Request(url, { method, mode });
}

function basicResponse(init = {}) {
  const headers = new Headers(init.headers || { 'content-type': 'text/javascript' });
  const response = {
    status: init.status ?? 200,
    ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
    type: init.type ?? 'basic',
    redirected: Boolean(init.redirected),
    url: init.url ?? 'https://scoreboard.thephillips.family/assets/app.js',
    headers,
    clone() {
      return basicResponse({ ...init, headers: Object.fromEntries(headers.entries()) });
    },
  };
  return response;
}

async function runFetch(request, response) {
  const puts = [];
  const waits = [];
  context.caches = {
    async match() {
      return undefined;
    },
    async open() {
      return {
        async put(req) {
          puts.push(String(req.url || req));
        },
      };
    },
  };
  context.fetch = async () => response;
  let body;
  listeners.fetch[0]({
    request,
    waitUntil(promise) {
      waits.push(promise);
    },
    respondWith(promise) {
      body = promise;
    },
  });
  if (body) await body;
  await Promise.all(waits);
  return puts;
}

const asset = page('https://scoreboard.thephillips.family/assets/app.js');
const assetPuts = await runFetch(asset, basicResponse());
assert.deepEqual(assetPuts, ['https://scoreboard.thephillips.family/assets/app.js']);

const cases = [
  ['api', page('https://scoreboard.thephillips.family/api/games'), basicResponse({ url: 'https://scoreboard.thephillips.family/api/games' })],
  ['api root', page('https://scoreboard.thephillips.family/api'), basicResponse()],
  ['json file', page('https://scoreboard.thephillips.family/manifest.json'), basicResponse({
    url: 'https://scoreboard.thephillips.family/manifest.json',
    headers: { 'content-type': 'application/json' },
  })],
  ['json body', asset, basicResponse({ headers: { 'content-type': 'application/json; charset=utf-8' } })],
  ['problem json', asset, basicResponse({ headers: { 'content-type': 'application/problem+json' } })],
  ['redirect 302', asset, basicResponse({ status: 302, url: 'https://auth.thephillips.family/' })],
  ['redirected flag', page('https://scoreboard.thephillips.family/', 'navigate'), basicResponse({
    redirected: true,
    url: 'https://auth.thephillips.family/?next=1',
    headers: { 'content-type': 'text/html' },
  })],
  ['set-cookie', asset, basicResponse({ headers: { 'content-type': 'text/html', 'set-cookie': 'family_session=abc; HttpOnly' } })],
  ['login', page('https://scoreboard.thephillips.family/login'), basicResponse({
    url: 'https://scoreboard.thephillips.family/login',
    headers: { 'content-type': 'text/html' },
  })],
  ['auth navigation', page('https://auth.thephillips.family/?next=https%3A%2F%2Fscoreboard.thephillips.family%2F', 'navigate'), basicResponse({
    url: 'https://auth.thephillips.family/',
    headers: { 'content-type': 'text/html' },
  })],
  ['opaque', asset, basicResponse({ type: 'opaque', status: 0 })],
];

for (const [name, request, response] of cases) {
  const puts = await runFetch(request, response);
  assert.deepEqual(puts, [], `cached ${name}`);
  assert.equal(policy.responseMustNotBeCached(request, response), true, name);
}

assert.equal(policy.isAuthNavigation(page('https://auth.thephillips.family/', 'navigate')), true);
assert.equal(policy.isAuthNavigation(page('https://scoreboard.thephillips.family/login', 'navigate')), true);
assert.equal(policy.isAuthNavigation(page('https://scoreboard.thephillips.family/', 'navigate')), false);
assert.equal(policy.isLoginPath('/author'), false);
assert.equal(policy.isLoginPath('/auth/callback'), true);
assert.equal(policy.requestMustNotBeCached(new Request('https://scoreboard.thephillips.family/api/session', { method: 'POST' })), true);
assert.equal(policy.responseMustNotBeCached(asset, basicResponse()), false);

assert.match(indexHtml, /viewport-fit=cover/);
assert.doesNotMatch(indexHtml, /user-scalable\s*=\s*no/);
assert.doesNotMatch(indexHtml, /maximum-scale\s*=\s*1/);
assert.match(indexHtml, /apple-touch-icon-180x180\.png/);
assert.doesNotMatch(indexHtml, /apple-touch-icon" href="\.\/images\/icons\/icon-192x192\.png"/);

for (const edge of ['top', 'right', 'bottom', 'left']) {
  assert.match(css, new RegExp(`padding-${edge}:\\s*env\\(safe-area-inset-${edge}\\)`));
}

const byPurpose = { any: new Set(), maskable: new Set() };
for (const icon of manifest.icons) {
  const size = pngSize(new URL(icon.src.replace(/^\.\//, 'public/'), root));
  const [w, h] = icon.sizes.split('x').map(Number);
  assert.equal(size.width, w, icon.src);
  assert.equal(size.height, h, icon.src);
  const purpose = icon.purpose || 'any';
  for (const part of purpose.split(/\s+/)) byPurpose[part].add(icon.sizes);
}
assert.ok(byPurpose.any.has('192x192'));
assert.ok(byPurpose.any.has('512x512'));
assert.ok(byPurpose.maskable.has('512x512'));

const apple = pngSize(new URL('public/images/icons/apple-touch-icon-180x180.png', root));
assert.deepEqual(apple, { width: 180, height: 180 });

console.log('pwa checks passed');
