# Scoreboard: Vite build + Express family gate (replaces bare nginx).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
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

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server/ ./server/
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production PORT=5000
USER node
EXPOSE 5000
CMD ["node", "server/server.cjs"]
