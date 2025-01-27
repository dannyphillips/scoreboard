const CACHE_NAME = 'scoreboard-v1';
const urlsToCache = [
  '/scoreboard/',
  '/scoreboard/index.html',
  '/scoreboard/manifest.json',
  '/scoreboard/images/logo-light.png',
  '/scoreboard/images/teams/home-team.png',
  '/scoreboard/images/teams/away-team.png',
  '/scoreboard/images/games/basketball-card.jpg',
  '/scoreboard/images/games/football-card.jpg',
  '/scoreboard/images/games/yahtzee-card.jpg',
  '/scoreboard/images/icons/icon-72x72.png',
  '/scoreboard/images/icons/icon-96x96.png',
  '/scoreboard/images/icons/icon-128x128.png',
  '/scoreboard/images/icons/icon-144x144.png',
  '/scoreboard/images/icons/icon-152x152.png',
  '/scoreboard/images/icons/icon-192x192.png',
  '/scoreboard/images/icons/icon-384x384.png',
  '/scoreboard/images/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
}); 