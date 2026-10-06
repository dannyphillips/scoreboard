# Production image for the scoreboard SPA.
# Vite inlines VITE_* at build time; the runtime image only serves static files.

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

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

RUN test -n "$VITE_FIREBASE_API_KEY" \
    && test -n "$VITE_FIREBASE_AUTH_DOMAIN" \
    && test -n "$VITE_FIREBASE_PROJECT_ID" \
    && test -n "$VITE_FIREBASE_APP_ID" \
    && npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
