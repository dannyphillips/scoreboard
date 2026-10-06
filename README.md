# Scoreboard

Client-side scoreboard SPA (Vite, React, TypeScript). Firebase Auth and Firestore stay in the browser. Production hosting is a static nginx image.

## Deploy on Dokku

The app is served at `scoreboard.thephillips.family`. The container listens on port 80. Vite inlines `VITE_*` values when the image is built, so they are Docker build args, not runtime config. Set them on the Dokku host only — do not commit them.

`package.json` would otherwise match the Node buildpack. Select the Dockerfile builder so Dokku builds this image:

```bash
dokku apps:create scoreboard
dokku domains:add scoreboard scoreboard.thephillips.family
dokku builder:set scoreboard selected dockerfile

dokku config:set --no-restart scoreboard \
  VITE_FIREBASE_API_KEY='...' \
  VITE_FIREBASE_AUTH_DOMAIN='...' \
  VITE_FIREBASE_PROJECT_ID='...' \
  VITE_FIREBASE_APP_ID='...' \
  VITE_BASE_URL='/'

dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_API_KEY'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_AUTH_DOMAIN'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_PROJECT_ID'
dokku docker-options:add scoreboard build '--build-arg VITE_FIREBASE_APP_ID'
dokku docker-options:add scoreboard build '--build-arg VITE_BASE_URL'
```

`VITE_BASE_URL` is optional. When that build arg is omitted, the image defaults to `/`.

From a clone of this repo:

```bash
git remote add dokku dokku@<dokku-host>:scoreboard
git push dokku main
```

Add `scoreboard.thephillips.family` to the Firebase project's authorized domains so Auth works on that host.
