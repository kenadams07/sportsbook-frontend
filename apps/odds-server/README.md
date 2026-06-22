# Odds Server

Internal Node.js service for ingesting sports odds from The Odds API, publishing odds deltas to Redis Pub/Sub, and persisting event/odds history to PostgreSQL.

This service is not user-facing. It exposes a small Fastify admin/observability API for configuration, health checks, quota visibility, metrics, and operational controls.

## Current Capabilities

- Fetch sports, events, and odds from The Odds API v4.
- Track quota headers from The Odds API.
- Protect paid `/odds` requests when quota is below the halt threshold.
- Store previous odds snapshots in Redis for diffing.
- Publish only changed odds to Redis channel `odds:{sportKey}`.
- Persist sports, events, and delta-only odds history to PostgreSQL.
- Run polling jobs through BullMQ.
- Schedule enabled sport configs from DB on startup.
- Control polling through admin APIs.
- Expose `/health`, `/quota`, and `/metrics`.

## Tech Stack

- Node.js 20
- TypeScript
- Fastify
- BullMQ
- ioredis
- Prisma 5
- PostgreSQL 16
- Axios
- Pino
- Vitest
- Docker Compose

## Architecture

```text
Fastify Admin API
  /sports
  /events
  /admin
  /health
  /quota
  /metrics

        |
        v

SportConfig DB rows
        |
        v
Scheduler Service
        |
        v
BullMQ Queue: odds-poll
        |
        v
Poller Worker
        |
        v
processPollResult()
        |
        +--> The Odds API /v4/sports/{sport}/odds
        |
        +--> Redis snapshot lookup: odds:snap:{eventId}
        |
        +--> Diff Engine
        |
        +--> Normaliser
        |
        +--> Redis PUBLISH: odds:{sportKey}
        |
        +--> Fire-and-forget DB persistence
```

## Data Flow

### 1. Configure Polling

An internal caller creates a sport config:

```http
POST /sports
```

```json
{
  "key": "baseball_mlb",
  "regions": ["us"],
  "markets": ["h2h"],
  "pollIntervalMs": 30000
}
```

The config is stored in `SportConfig` and a BullMQ scheduler is created.

### 2. Poll Odds

The worker calls:

```text
GET /v4/sports/{sportKey}/odds
```

with:

```text
regions=...
markets=...
oddsFormat=decimal
dateFormat=iso
```

### 3. Diff Against Redis Snapshot

For each event:

```text
previous snapshot from Redis
vs
current API event
```

Only new or changed outcomes become deltas.

Redis snapshot key:

```text
odds:snap:{eventId}
```

### 4. Enrich Deltas

The normaliser adds:

- `impliedProb`
- `overround`
- `ts`

### 5. Publish Deltas

Changed odds are published to:

```text
odds:{sportKey}
```

Example:

```text
odds:baseball_mlb
```

### 6. Persist History

After Redis publish, DB writes start in the background:

```text
Sport -> Event -> OddsSnapshot
```

Order matters because of foreign keys.

`OddsSnapshot` stores delta-only history, not full snapshots every poll.

## Redis Message Contract

Published messages are JSON arrays of odds deltas:

```ts
type OddsDelta = {
  eventId: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  bookmaker: string;
  market: string;
  outcome: string;
  price: number;
  prevPrice: number | null;
  point: number | null;
  moved: "up" | "down" | "new";
  impliedProb: number;
  overround: number;
  ts: number;
};
```

## Project Structure

```text
src/
  api/
    controllers/
    routes/
    server.ts

  config/
    index.ts

  db/
    client.ts
    repositories/

  ingestion/
    odds-api.client.ts
    odds-api.errors.ts
    poll.queue.ts
    poller.worker.ts
    process-poll-result.ts
    quota.guard.ts
    scheduler.service.ts

  processing/
    diff.engine.ts
    normaliser.ts
    process-event.ts
    snapshot.store.ts

  publisher/
    redis.publisher.ts

  redis/
    client.ts
    keys.ts
    paused-sports.store.ts

  services/

  types/

  logger.ts
  main.ts
```

## Prerequisites

- Node.js 20
- npm
- Docker Desktop
- The Odds API key

Check Node:

```powershell
node -v
```

Expected:

```text
v20.x
```

## Environment

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Example:

```env
ODDS_API_KEY=your_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com

REDIS_HOST=127.0.0.1
REDIS_PORT=6380
REDIS_PASSWORD=

DATABASE_URL="postgresql://odds:odds@127.0.0.1:5433/odds"

PORT=3001
NODE_ENV=development

QUOTA_PAUSE_THRESHOLD=50
QUOTA_HALT_THRESHOLD=10

POLL_INTERVAL_LIVE=5000
POLL_INTERVAL_SOON=15000
POLL_INTERVAL_PREMATCH=30000

BULL_CONCURRENCY=3
```

### Local Port Notes

This project maps Docker services to non-default host ports because this machine already had local services on default ports:

- Docker Postgres: host `5433` -> container `5432`
- Docker Redis: host `6380` -> container `6379`

That is why `.env` should use:

```env
REDIS_PORT=6380
DATABASE_URL="postgresql://odds:odds@127.0.0.1:5433/odds"
```

## Install

```powershell
npm install
```

## Start Infrastructure

```powershell
docker compose up -d
```

Verify:

```powershell
docker ps
```

## Prisma

This project uses Prisma 5.

Check:

```powershell
npx prisma --version
```

Expected:

```text
prisma         : 5.22.0
@prisma/client : 5.22.0
```

Prisma 5 keeps the database URL in the shared schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The workspace Prisma schema and migrations live in:

```text
../../packages/db/prisma
```

Run Prisma commands from the workspace root:

```bash
npm run db:generate
npm run db:migrate
```

Do not use Prisma 7 style `prisma/config` unless the project is upgraded to Prisma 7.

Apply migrations:

```powershell
npx prisma migrate dev
```

Generate client:

```powershell
npx prisma generate
```

Open Prisma Studio:

```powershell
npx prisma studio
```

## Development

Start dev server:

```powershell
npm run dev
```

The dev script uses watch mode:

```text
tsx watch src/main.ts
```

Server:

```text
http://127.0.0.1:3001
```

Build:

```powershell
npm run build
```

Run compiled app:

```powershell
npm start
```

Tests:

```powershell
npm test -- --run
```

## API Reference

### Health

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "redis": "ok",
  "db": "ok"
}
```

### Quota

```http
GET /quota
```

Response:

```json
{
  "remaining": 473,
  "used": 27,
  "resetAt": null
}
```

### Metrics

```http
GET /metrics
```

Prometheus text format:

```text
odds_active_sports 0
odds_events_total 23
odds_live_events 0
odds_snapshots_total 1768
odds_quota_remaining 473
odds_quota_used 27
```

### List Sport Configs

```http
GET /sports
```

### Create Sport Config

```http
POST /sports
Content-Type: application/json
```

```json
{
  "key": "baseball_mlb",
  "regions": ["us"],
  "markets": ["h2h"],
  "pollIntervalMs": 30000
}
```

Fields:

- `key`: Odds API sport key.
- `regions`: Odds API regions.
- `markets`: Odds API markets.
- `pollIntervalMs`: optional admin override for polling interval.

If `pollIntervalMs` is omitted or `null`, the scheduler uses the default prematch interval for now.

### Update Sport Config

```http
PATCH /sports/:key
Content-Type: application/json
```

```json
{
  "regions": ["us"],
  "markets": ["h2h", "totals"],
  "enabled": true,
  "pollIntervalMs": 15000
}
```

Set `pollIntervalMs` to `null` to clear the admin override.

### Delete Sport Config

```http
DELETE /sports/:key
```

Deletes the config and removes the scheduler for that sport.

### List Events

```http
GET /events/:sportKey
```

Query params:

```text
status=live|pre_match|all
limit=50
offset=0
```

Example:

```http
GET /events/baseball_mlb?status=pre_match&limit=5
```

### List Live Events

```http
GET /events/:sportKey/live
```

### Pause Sport Polling

```http
POST /admin/pause/:sportKey
Content-Type: application/json
```

```json
{}
```

This stores the sport key in Redis set:

```text
odds:paused
```

When paused, `processPollResult()` skips the Odds API call.

### Resume Sport Polling

```http
POST /admin/resume/:sportKey
Content-Type: application/json
```

```json
{}
```

### Force Poll

```http
POST /admin/force-poll/:sportKey
Content-Type: application/json
```

```json
{}
```

Looks up the sport config and enqueues an immediate BullMQ job.

## Manual Testing

### Subscribe To Redis Deltas

```powershell
docker exec -it sportbooks-odds-redis-1 redis-cli SUBSCRIBE odds:baseball_mlb
```

### Force Deltas By Clearing Redis Snapshots

Development only:

```powershell
docker exec sportbooks-odds-redis-1 sh -c "redis-cli --scan --pattern 'odds:snap:*' | xargs -r redis-cli DEL"
```

Next poll will treat outcomes as new and publish many deltas.

### Manually Run One Poll

```powershell
node --input-type=module -e "Promise.all([import('./dist/redis/client.js'), import('./dist/db/client.js'), import('./dist/ingestion/process-poll-result.js')]).then(async ([r,d,m]) => { await r.connectRedis(); await d.connectDb(); const result = await m.processPollResult('baseball_mlb', ['us'], ['h2h']); console.log(result); await new Promise(resolve => setTimeout(resolve, 3000)); await r.disconnectRedis(); await d.disconnectDb(); })"
```

### Manually Add A BullMQ Job

```powershell
node --input-type=module -e "import('./dist/ingestion/poll.queue.js').then(async q => { const job = await q.pollQueue.add('manual-poll', { sportKey: 'baseball_mlb', regions: ['us'], markets: ['h2h'] }); console.log(job.id); await q.pollQueue.close(); })"
```

## Database Models

### Sport

Stores sport metadata.

### SportConfig

Stores what the server should poll:

- sport key
- regions
- markets
- enabled flag
- optional `pollIntervalMs`

### Event

Stores event metadata.

### OddsSnapshot

Stores delta-only odds history.

This table can grow quickly. It should eventually move to a time-series strategy such as TimescaleDB with compression and retention policies.

## Quota Behavior

Only paid `/odds` requests are blocked by quota guard.

Free endpoints such as `/v4/sports` and `/events` can still run when quota is low.

Current behavior:

- response interceptor stores `x-requests-remaining`
- response interceptor stores `x-requests-used`
- paid request interceptor calls quota guard
- low quota throws `QuotaPausedError`
- worker treats quota pause as skipped, not failed

## Error Handling

The Odds API errors are converted into typed errors:

- `OddsApiAuthError`: 401/403
- `OddsApiNotFoundError`: 404
- `OddsApiRateLimitError`: 429
- `OddsApiServerError`: 5xx

BullMQ retries failed poll jobs with exponential backoff.

## Shutdown Behavior

The app handles:

- `SIGINT`
- `SIGTERM`
- `unhandledRejection`
- `uncaughtException`

Shutdown closes:

- poller worker
- BullMQ queue
- Fastify server
- Redis clients
- Prisma client

## Important Design Decisions

### Delta-Only History

The service does not persist every raw odds snapshot to Postgres.

It persists only changed/new odds deltas.

This prevents the DB from growing as fast as:

```text
sports * events * bookmakers * markets * outcomes * poll cycles
```

### Redis For Current Snapshots

Redis stores short-lived event snapshots for diffing.

Postgres stores historical movements.

### Admin Poll Interval Override

Admins can set `pollIntervalMs` per sport config.

Adaptive intervals are deferred for now. A later version can use:

- live interval
- soon interval
- prematch interval

unless admin override exists.

### TimescaleDB Future

`OddsSnapshot` is time-series data.

Future production storage should evaluate:

- TimescaleDB hypertable on `capturedAt`
- compression policies
- retention policies
- continuous aggregates

The app already isolates odds history writes in `odds.repo.ts`, making future migration easier.

## Troubleshooting

### Prisma Config Warning

This project uses Prisma 5. If VS Code warns that the database URL should move to `prisma.config.ts`, that warning is Prisma 7 guidance.

For Prisma 5, this is correct:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Prisma Generate EPERM On Windows

If this happens:

```text
EPERM: operation not permitted, rename query_engine-windows.dll.node
```

Stop the running dev server and regenerate:

```powershell
npx prisma generate
```

### Redis Messages Not Appearing

Make sure the app and subscriber are using the same Redis.

This project uses Docker Redis on host port `6380`.

`.env`:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6380
```

Subscriber:

```powershell
docker exec -it sportbooks-odds-redis-1 redis-cli SUBSCRIBE odds:baseball_mlb
```

### BullMQ Queue Name

BullMQ queue names should not contain `:`.

Use:

```text
odds-poll
```

Not:

```text
odds:poll
```

## Useful Commands

```powershell
docker compose up -d
npm run dev
npm run build
npm test -- --run
npx prisma studio
npx prisma migrate status
```

## Roadmap

See:

```text
PROJECT_CHECKLIST.md
```

for the living implementation checklist.
