# Implementation Plan — Odds Server
**Version:** 1.0  
**Date:** 2026-06-05  
**Estimated total:** ~10–14 days solo

---

## Guiding Rules

1. **Build in layers** — each phase must be fully working before the next starts
2. **Hot path first** — get poll → diff → publish working before any Fastify API
3. **Never break the publish path** — DB and API are secondary concerns
4. **Test at every phase** — not at the end

---

## Phase 0 — Project Setup (Day 1)

**Goal:** Repo scaffolded, tooling configured, Docker stack running, env validated.

- [ ] `npm init`, TypeScript config (`tsconfig.json` with strict mode)
- [ ] Install all dependencies:
  ```
  fastify @fastify/sensible
  bullmq ioredis
  prisma @prisma/client
  axios
  pino pino-pretty
  zod
  vitest
  ```
- [ ] Configure `tsconfig.json` — `target: ES2022`, `module: NodeNext`, `strict: true`
- [ ] Set up `src/config/index.ts` — zod schema for all env vars, crash on invalid
- [ ] Set up `docker-compose.yml` — Redis + Postgres services
- [ ] Set up `.env.example` with all required vars
- [ ] Verify Docker stack starts cleanly
- [ ] Set up Prisma — `prisma init`, write full schema (Sport, SportConfig, Event, OddsSnapshot)
- [ ] Run first migration: `prisma migrate dev --name init`
- [ ] Set up `src/redis/client.ts` — two ioredis connections (client + subscriber)
- [ ] Set up `src/redis/keys.ts` — all key name functions
- [ ] Write `src/main.ts` boot sequence — connect Redis, connect Prisma, log ready

**Exit criteria:** `npm run dev` starts, Redis and Postgres connect, no errors.

---

## Phase 1 — Odds API Client (Day 2)

**Goal:** Can fetch real odds data from The Odds API, quota headers tracked.

- [ ] Write `src/types/odds-api.types.ts` — full TypeScript types matching API response shapes:
  - `OddsApiSport`
  - `OddsApiEvent`
  - `OddsApiBookmaker`
  - `OddsApiMarket`
  - `OddsApiOutcome`
- [ ] Write `src/ingestion/odds-api.client.ts`:
  - Axios instance with `baseURL`, `timeout: 10000`
  - Response interceptor — extract `x-requests-remaining`, `x-requests-used`, `x-requests-last` → store in Redis quota keys
  - Request interceptor — check quota guard before every request
  - Typed methods: `getSports()`, `getOdds(sport, regions, markets)`, `getEvents(sport)`
- [ ] Write `src/ingestion/quota.guard.ts`:
  - `update(remaining, used)` — writes to Redis
  - `check()` — throws `QuotaPausedError` if below `QUOTA_PAUSE_THRESHOLD`
  - `halt()` — logs critical alert if below `QUOTA_HALT_THRESHOLD`
  - `getStatus()` — returns current credit stats
- [ ] Manual test: call `getSports()`, log response, verify quota headers captured

**Exit criteria:** Can fetch sports list and odds for `soccer_epl`, quota values visible in Redis.

---

## Phase 2 — Diff Engine + Normaliser (Day 3)

**Goal:** Given two API responses, produce correct enriched deltas. Fully unit tested.

- [ ] Write `src/types/internal.types.ts`:
  - `NormalisedEvent`
  - `OddsDelta` (the Redis publish contract)
- [ ] Write `src/processing/diff.engine.ts`:
  - Pure function: `diff(prev: OddsApiEvent[] | null, curr: OddsApiEvent[]): RawDelta[]`
  - Build lookup map from prev: key = `${bookmaker}:${market}:${outcome}`
  - For each outcome in curr: compare price with tolerance `0.0001`
  - Emit only changed/new outcomes
- [ ] Write `src/processing/normaliser.ts`:
  - Pure function: `normalise(event: OddsApiEvent, deltas: RawDelta[]): OddsDelta[]`
  - Compute `impliedProb = 1 / price`
  - Compute `overround` — sum of all implied probs per market
  - Set `moved: "up" | "down" | "new"`
- [ ] Write `src/processing/snapshot.store.ts`:
  - `getSnapshot(eventId)` — Redis GET + JSON.parse
  - `setSnapshot(eventId, data)` — JSON.stringify + Redis SET with TTL
- [ ] Write unit tests:
  - `tests/unit/diff.engine.test.ts` — 10+ cases: no change, price up, price down, new outcome, missing bookmaker
  - `tests/unit/normaliser.test.ts` — implied prob calculation, overround, moved flags

**Exit criteria:** All unit tests pass. Diff correctly returns zero deltas when nothing changed.

---

## Phase 3 — Publisher + Hot Path (Day 4)

**Goal:** End-to-end: fetch → diff → normalise → publish. The core loop working.

- [ ] Write `src/publisher/redis.publisher.ts`:
  - `publish(sportKey, deltas, snapshot)`:
    1. `await redis.publish(keys.channel(sportKey), JSON.stringify(deltas))`
    2. `await redis.pipeline().set(keys.snapshot(eventId), ...).exec()` (batch all events)
    3. `dbWriter.writeOdds(deltas).catch(logger.error)` ← fire and forget
    4. `dbWriter.upsertEvents(events).catch(logger.error)` ← fire and forget
- [ ] Wire the pipeline in a single `processPollResult(sportKey, regions, markets)` function:
  ```
  const raw = await oddsApiClient.getOdds(sport, regions, markets)
  for each event:
    const prev = await snapshotStore.getSnapshot(event.id)
    const rawDeltas = diff(prev, event)
    if rawDeltas.length === 0: continue
    const deltas = normalise(event, rawDeltas)
    await publisher.publish(sportKey, deltas, event)
  ```
- [ ] Manual end-to-end test: call `processPollResult("soccer_epl", ["uk"], ["h2h"])`, verify Redis receives messages (`redis-cli SUBSCRIBE odds:soccer_epl`)
- [ ] Verify DB writes land in `odds_snapshots` table asynchronously
- [ ] Add Pino structured logging at each step with timing

**Exit criteria:** `redis-cli SUBSCRIBE odds:soccer_epl` receives messages when odds change. DB shows snapshot rows.

---

## Phase 4 — Scheduler + BullMQ Workers (Day 5)

**Goal:** Automated polling loop running, adaptive intervals working.

- [ ] Write `src/ingestion/poller.worker.ts`:
  - BullMQ Worker consuming `POLL_QUEUE`
  - Job payload: `{ sportKey, regions, markets }`
  - Calls `processPollResult()`
  - On `QuotaPausedError`: do not fail job, delay 30s
  - On network error: let BullMQ retry with backoff
  - Concurrency: `BULL_CONCURRENCY` (default 3)
- [ ] Write `src/ingestion/scheduler.service.ts`:
  - `start(configs: SportConfig[])` — for each config, determine interval, add BullMQ repeatable job
  - `addSport(config)` — add new job dynamically (called by Fastify API)
  - `removeSport(sportKey)` — remove repeatable job
  - `adjustInterval(sportKey)` — called after each poll to re-evaluate if live events exist
  - Interval logic:
    ```
    hasLiveEvents(sportKey) → POLL_INTERVAL_LIVE (5s)
    hasSoonEvents(sportKey) → POLL_INTERVAL_SOON (15s)
    else                    → POLL_INTERVAL_PREMATCH (30s)
    ```
- [ ] Load SportConfigs from DB on startup and pass to `scheduler.start()`
- [ ] Verify in logs that jobs fire at expected intervals

**Exit criteria:** Logs show repeating polls for each configured sport. Live events poll at 5s.

---

## Phase 5 — DB Repositories (Day 6)

**Goal:** Sports, events, and odds persisted correctly without blocking publish path.

- [ ] Write `src/db/repositories/sport.repo.ts`:
  - `upsertMany(sports: OddsApiSport[])` — batch upsert to `sports` table
- [ ] Write `src/db/repositories/event.repo.ts`:
  - `upsertMany(events: OddsApiEvent[])` — batch upsert
  - `updateStatus(eventId, status)` — mark live/settled
  - `findBySport(sportKey, filters)` — for API queries
- [ ] Write `src/db/repositories/odds.repo.ts`:
  - `bulkInsert(deltas: OddsDelta[])` — batch insert to `odds_snapshots`
  - Use `createMany` with `skipDuplicates: false` (we want full history)
- [ ] Add event status update logic in poller: after fetching, compare `commence_time < now` → update status to `LIVE`
- [ ] Write integration test with real Postgres (testcontainers or local):
  - Insert sport → insert events → insert odds → verify rows

**Exit criteria:** After a poll cycle, sports/events/odds all appear in DB. No inserts block the publish.

---

## Phase 6 — Fastify API (Days 7–8)

**Goal:** Full admin and configuration REST API running.

- [ ] Write `src/api/server.ts`:
  - Fastify instance with `@fastify/sensible`, JSON schema validation
  - Register all route plugins
  - Start on `PORT`
- [ ] Write `src/api/routes/sports.routes.ts`:
  - `POST /sports` → validate body → upsert SportConfig → call `scheduler.addSport()`
  - `GET /sports` → return all SportConfigs from DB
  - `PATCH /sports/:key` → update config → restart job
  - `DELETE /sports/:key` → remove config → call `scheduler.removeSport()`
- [ ] Write `src/api/routes/events.routes.ts`:
  - `GET /events/:sportKey` with query params `status`, `limit`, `offset`
  - `GET /events/:sportKey/live`
- [ ] Write `src/api/routes/admin.routes.ts`:
  - `POST /admin/pause/:sportKey`
  - `POST /admin/resume/:sportKey`
  - `POST /admin/force-poll/:sportKey`
  - `GET /quota`
- [ ] Write `src/api/routes/health.routes.ts`:
  - `GET /health` — ping Redis + Prisma
  - `GET /metrics` — Prometheus format counters/gauges
- [ ] Add Fastify JSON schema validation for all request bodies
- [ ] Manual test all routes with curl/Postman

**Exit criteria:** All routes return correct responses. `POST /sports` triggers polling within one interval.

---

## Phase 7 — Observability + Hardening (Day 9)

**Goal:** Production-grade logging, metrics, and error handling.

- [ ] Add Pino request logging to Fastify
- [ ] Add structured log context to every stage:
  - `{ sportKey, eventCount, deltaCount, publishMs, phase: "poll"|"diff"|"publish" }`
- [ ] Implement Prometheus counters in `src/metrics.ts`:
  - `odds_polls_total` (counter, labels: sportKey, status)
  - `odds_publish_total` (counter, labels: sportKey)
  - `odds_deltas_total` (counter, labels: sportKey, market, moved)
  - `quota_remaining` (gauge)
  - `poll_duration_ms` (histogram)
  - `publish_duration_ms` (histogram)
- [ ] Wire metrics into `/metrics` route
- [ ] Add graceful shutdown:
  - On SIGTERM: stop scheduler, drain BullMQ workers, close Redis, close Prisma
- [ ] Add uncaught exception + unhandled rejection handlers
- [ ] Test: kill Redis mid-run, verify service recovers when Redis comes back

**Exit criteria:** Grafana can scrape `/metrics`. Logs are structured JSON. Service recovers from Redis restart.

---

## Phase 8 — Integration with NestJS (Day 10)

**Goal:** NestJS backend successfully receives odds messages and confirms message shape.

- [ ] Share `OddsDelta` TypeScript type with NestJS team (copy to their repo or publish as internal package)
- [ ] Provide NestJS team with:
  - Redis connection details
  - Channel pattern: `odds:{sport_key}`
  - List of sport keys being published
  - Example message JSON
- [ ] Coordinate a smoke test:
  - NestJS subscribes to `odds:soccer_epl`
  - Odds server polls and publishes
  - Verify NestJS receives and logs the message
- [ ] Verify no message format issues, adjust types if needed

**Exit criteria:** NestJS team confirms they receive correctly shaped messages.

---

## Phase 9 — Final Testing + Cleanup (Days 11–12)

- [ ] Complete unit test coverage for diff engine and normaliser (aim > 90%)
- [ ] Integration test: full poll cycle with mock Odds API (nock or msw)
- [ ] Load test: simulate 10 sports polling simultaneously, measure Redis publish latency
- [ ] Review all `catch` blocks — nothing swallowed silently without a log
- [ ] Review all `any` types — replace with proper types
- [ ] Check memory usage under sustained polling: `process.memoryUsage()`
- [ ] Final review of `.env.example` — all vars documented
- [ ] Write `README.md` with setup steps, env vars, and API reference

---

## Phase 10 — Deployment (Days 13–14)

- [ ] Write `Dockerfile`:
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build
  RUN npx prisma generate
  CMD ["node", "dist/main.js"]
  ```
- [ ] Write production `docker-compose.yml` (no volume mounts, restart: always)
- [ ] Set up GitHub Actions CI:
  - On push: lint → type-check → test → build
- [ ] Deploy to server, run `prisma migrate deploy`
- [ ] Verify health endpoint returns 200
- [ ] Verify quota endpoint shows real credits
- [ ] Monitor logs for first 30 minutes

---

## Dependency Map

```
Phase 0 (setup)
  └── Phase 1 (API client)
       └── Phase 2 (diff + normaliser)  ← can be done in parallel with Phase 1
            └── Phase 3 (publisher + hot path)
                 └── Phase 4 (scheduler + BullMQ)
                      ├── Phase 5 (DB repos)   ← parallel with Phase 6
                      └── Phase 6 (Fastify API)
                           └── Phase 7 (observability)
                                └── Phase 8 (NestJS integration)
                                     └── Phase 9 (testing)
                                          └── Phase 10 (deployment)
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Quota burns out during development | High | High | Use `QUOTA_PAUSE_THRESHOLD=200` in dev, mock API for most tests |
| NestJS team changes Redis config | Medium | Medium | Agree on Redis connection details in Phase 0 |
| The Odds API changes response shape | Low | High | All types in `odds-api.types.ts`, interceptor unit tested |
| Redis latency spikes on shared instance | Medium | Medium | Run dedicated Redis instance for odds-server |
| DB write backlog causes memory leak | Low | Medium | Cap the async write queue with a semaphore if needed |

---

## Definition of Done

- [ ] All phases complete
- [ ] Odds messages flowing in Redis, confirmed by NestJS team
- [ ] DB contains sports, events, and odds history rows
- [ ] `GET /health` returns 200 in production
- [ ] Quota never drops below `QUOTA_HALT_THRESHOLD` in first 48 hours
- [ ] No unhandled exceptions in production logs
- [ ] README complete
