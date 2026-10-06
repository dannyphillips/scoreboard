# Scoreboard

Vite + React + TypeScript scoreboard. Firebase Auth and Firestore run in the browser; this repo has no backend.

`vite.config.ts` sets `base` from `VITE_BASE_URL`, defaulting to `/` so the app works at the domain root. The GitHub Pages workflow sets `VITE_BASE_URL=/scoreboard/`; leave that variable unset for this Dokku app.

## Dokku

Production is the root `Dockerfile`: Node builds the Vite app, then nginx serves `dist/` with an SPA fallback. Deploy to [scoreboard.thephillips.family](https://scoreboard.thephillips.family).

On the Dokku host:

```bash
dokku apps:create scoreboard
dokku builder:set scoreboard selected dockerfile
dokku domains:add scoreboard scoreboard.thephillips.family

# Docker build-args. Vite inlines these into the client bundle. Do not commit them.
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_API_KEY=<api-key>'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_AUTH_DOMAIN=<auth-domain>'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_PROJECT_ID=<project-id>'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_APP_ID=<app-id>'
# Optional. Defaults to /.
# dokku docker-options:add scoreboard build '--build-arg VITE_BASE_URL=/'
```

From a checkout of this repo:

```bash
git remote add dokku dokku@<dokku-host>:scoreboard
git push dokku main
```

Changing a `VITE_*` value requires another image build (`git push dokku main`, or `dokku ps:rebuild scoreboard` after updating the build-arg).
