# Build the Vite SPA, then serve dist/ with nginx.
# Firebase config is injected at image build time (Vite inlines VITE_* into the client bundle).
# Pass values with --build-arg. Do not hardcode secrets here.

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
# package-lock.json was created on macOS, so npm ci omits Rollup's Linux
# optional binary (https://github.com/npm/cli/issues/4828). Vite's build needs it.
RUN rollup_version="$(node -p "require('./node_modules/rollup/package.json').version")" \
    && npm install --no-save "@rollup/rollup-linux-x64-musl@${rollup_version}"

COPY . .

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_BASE_URL=/

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
