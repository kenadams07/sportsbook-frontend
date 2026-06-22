FROM node:20-bookworm-slim AS build

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/admin-server/package.json apps/admin-server/package.json
COPY apps/odds-server/package.json apps/odds-server/package.json
COPY apps/user-server/package.json apps/user-server/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/logger/package.json packages/logger/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json

RUN npm ci

COPY . .

RUN npm run db:generate && npm run build

FROM node:20-bookworm-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app /app

ARG APP_WORKSPACE
ENV APP_WORKSPACE=$APP_WORKSPACE

CMD ["sh", "-c", "npm --workspace \"$APP_WORKSPACE\" run start"]