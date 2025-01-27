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
  '/scoreboard/images/games/yahtzee-card.jpg'
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