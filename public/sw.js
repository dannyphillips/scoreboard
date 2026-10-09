const CACHE_NAME = 'scoreboard-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './images/logo-light.png',
  './images/teams/home-team.png',
  './images/teams/away-team.png',
  './images/games/basketball-card.jpg',
  './images/games/football-card.jpg',
  './images/games/yahtzee-card.jpg',
  './images/icons/icon-72x72.png',
  './images/icons/icon-96x96.png',
  './images/icons/icon-128x128.png',
  './images/icons/icon-144x144.png',
  './images/icons/icon-152x152.png',
  './images/icons/apple-touch-icon-180x180.png',
  './images/icons/icon-192x192.png',
  './images/icons/icon-384x384.png',
  './images/icons/icon-512x512.png',
  './images/icons/icon-512x512-maskable.png'
];

const LOGIN_ROUTES = [
  '/login',
  '/log-in',
  '/signin',
  '/sign-in',
  '/signup',
  '/sign-up',
  '/logout',
  '/log-out',
  '/auth',
  '/sso',
  '/oauth',
  '/callback'
];

const AUTH_HOST = 'auth.thephillips.family';

function normalizePath(pathname) {
  const path = String(pathname || '/').toLowerCase();
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

function isApiPath(pathname) {
  const path = normalizePath(pathname);
  return path === '/api' || path.startsWith('/api/');
}

function isJsonPath(pathname) {
  return normalizePath(pathname).endsWith('.json');
}

function isLoginPath(pathname) {
  const path = normalizePath(pathname);
  return LOGIN_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}

function isAuthHost(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/\.$/, '');
  return host === AUTH_HOST || host.endsWith(`.${AUTH_HOST}`);
}

function urlOf(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isAuthNavigation(request) {
  if (!request || request.mode !== 'navigate') return false;
  const url = urlOf(request.url);
  if (!url) return true;
  return isAuthHost(url.hostname) || isLoginPath(url.pathname);
}

function requestMustNotBeCached(request) {
  if (!request || request.method !== 'GET') return true;
  const url = urlOf(request.url);
  if (!url) return true;
  if (isApiPath(url.pathname)) return true;
  if (isJsonPath(url.pathname)) return true;
  if (isLoginPath(url.pathname)) return true;
  if (isAuthHost(url.hostname)) return true;
  if (isAuthNavigation(request)) return true;
  return false;
}

function isRedirectResponse(response) {
  if (!response) return false;
  if (response.redirected) return true;
  if (response.type === 'opaqueredirect') return true;
  const status = response.status;
  return status === 300 || status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

function hasSetCookie(headers) {
  if (!headers) return false;
  if (typeof headers.getSetCookie === 'function') {
    const cookies = headers.getSetCookie();
    if (Array.isArray(cookies) && cookies.length > 0) return true;
  }
  if (typeof headers.has === 'function' && headers.has('set-cookie')) return true;
  if (typeof headers.get === 'function') {
    const raw = headers.get('set-cookie');
    if (typeof raw === 'string' && raw.length > 0) return true;
  }
  return false;
}

function isJsonResponse(headers) {
  if (!headers || typeof headers.get !== 'function') return false;
  const contentType = headers.get('content-type') || '';
  return /json/i.test(contentType);
}

function responseUrlIsSensitive(response) {
  const url = urlOf(response && response.url);
  if (!url) return false;
  return isApiPath(url.pathname) || isLoginPath(url.pathname) || isAuthHost(url.hostname);
}

function responseMustNotBeCached(request, response) {
  try {
    if (!response) return true;
    if (requestMustNotBeCached(request)) return true;
    if (response.type && response.type !== 'basic') return true;
    if (isRedirectResponse(response)) return true;
    if (response.status !== 200) return true;
    if (hasSetCookie(response.headers)) return true;
    if (isJsonResponse(response.headers)) return true;
    if (responseUrlIsSensitive(response)) return true;
    if (request && request.mode === 'navigate' && (isRedirectResponse(response) || responseUrlIsSensitive(response))) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

async function storeResponse(cache, request, response) {
  if (responseMustNotBeCached(request, response)) return false;
  const cacheRequest = new Request(new URL(request.url).href, { method: 'GET' });
  await cache.put(cacheRequest, response.clone());
  return true;
}

async function precacheUrl(cache, url) {
  const request = new Request(url, { method: 'GET', redirect: 'manual' });
  const response = await fetch(request);
  if (isRedirectResponse(response) || response.type === 'opaqueredirect') return;
  if (responseMustNotBeCached(request, response)) {
    if (response.ok) return;
    throw new Error(`Precache failed for ${url}: ${response.status}`);
  }
  await cache.put(request, response);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all(PRECACHE_URLS.map((url) => precacheUrl(cache, url))))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
});

async function networkFirst(event, request) {
  try {
    const response = await fetch(request);
    if (!responseMustNotBeCached(request, response)) {
      const copy = response.clone();
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => storeResponse(cache, request, copy))
          .catch(() => undefined)
      );
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(event, request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (!responseMustNotBeCached(request, response)) {
    const copy = response.clone();
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => storeResponse(cache, request, copy))
        .catch(() => undefined)
    );
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!request || request.method !== 'GET') return;

  // Auth, login, and API calls always hit the network and are never written to Cache Storage.
  if (requestMustNotBeCached(request)) {
    event.respondWith(fetch(request));
    return;
  }

  // Document loads are network-first so a family SSO redirect is not hidden by a cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event, request));
    return;
  }

  event.respondWith(cacheFirst(event, request));
});

self.__scoreboardSw = {
  requestMustNotBeCached,
  responseMustNotBeCached,
  isAuthNavigation,
  isLoginPath,
  isApiPath,
  isAuthHost
};
