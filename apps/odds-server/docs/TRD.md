# TRD — Odds Server
**Version:** 1.0  
**Status:** Draft  
**Author:** Aman  
**Date:** 2026-06-05  
**Depends on:** PRD v1.0

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS + TypeScript 5 | I/O-bound workload, fast enough, full-stack consistency |
| HTTP API | Fastify 4 | Fastest Node HTTP framework, schema validation built-in |
| Job Queue | BullMQ 5 | Redis-backed priority queue, concurrency control, retry logic |
| Redis Client | ioredis 5 | Most performant Node Redis client, pipeline support |
| DB ORM | Prisma 5 | TypeScript-native, migration tooling, type-safe queries |
| Database | PostgreSQL 16 | Reliable, JSONB support, good for time-series with indexing |
| HTTP Client | Axios 1.x | Interceptor support for quota header extraction |
| Logger | Pino | Fastest Node logger, structured JSON, near-zero overhead |
| Process Manager | PM2 (dev) / Docker (prod) | |
| Testing | Vitest + testcontainers | Fast, native TypeScript, real Redis/Postgres in tests |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Odds Server                       │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐  │
│  │Scheduler │───▶│  Poller  │───▶│ Diff Engine   │  │
│  │(BullMQ)  │    │(Axios)   │    │ (in-memory)   │  │
│  └──────────┘    └──────────┘    └──────┬────────┘  │
│                                         │            │
│                                   ┌─────▼────────┐  │
│                                   │  Normaliser  │  │
│                                   │ (sync, RAM)  │  │
│                                   └─────┬────────┘  │
│                                         │            │
│                          ┌──────────────▼──────────┐ │
│                          │     Redis Publisher      │ │
│                          │  PUBLISH odds:{sport}    │ │
│                          └──────────────┬──────────┘ │
│                                         │             │
│           ┌─────────────────────────────┤             │
│           │                             │             │
│    ┌──────▼──────┐             ┌────────▼──────┐     │
│    │  DB Writer  │             │  Redis Snap   │     │
│    │  (async)    │             │  SET + TTL    │     │
│    └──────┬──────┘             └───────────────┘     │
│           │                                           │
│    ┌──────▼──────┐                                   │
│    │ PostgreSQL  │                                   │
│    └─────────────┘                                   │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │          Fastify Admin API (port 3001)          │ │
│  │  /sports  /events  /health  /quota  /metrics   │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
         │ PUBLISH odds:{sport_key}
         ▼
    Redis (shared with NestJS)
         │ SUBSCRIBE
         ▼
    NestJS Backend → WebSocket → Frontend
```

---

## 3. Folder Structure

```
odds-server/
├── src/
│   ├── config/
│   │   ├── index.ts                  # Env var validation with zod
│   │   └── sports.config.ts          # Default sport configs
│   │
│   ├── ingestion/
│   │   ├── odds-api.client.ts        # Axios instance, quota interceptor
│   │   ├── poller.worker.ts          # BullMQ worker process
│   │   ├── scheduler.service.ts      # Enqueues jobs by priority
│   │   └── quota.guard.ts            # Credit tracking + pause logic
│   │
│   ├── processing/
│   │   ├── diff.engine.ts            # Pure function: prev+next → deltas[]
│   │   ├── normaliser.ts             # Adds impliedProb, overround, moved
│   │   └── snapshot.store.ts         # Redis GET/SET previous snapshot
│   │
│   ├── publisher/
│   │   └── redis.publisher.ts        # PUBLISH + fire-and-forget DB write
│   │
│   ├── db/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── repositories/
│   │   │   ├── sport.repo.ts
│   │   │   ├── event.repo.ts
│   │   │   └── odds.repo.ts
│   │   └── client.ts                 # Prisma singleton
│   │
│   ├── redis/
│   │   ├── client.ts                 # ioredis singleton (two connections)
│   │   └── keys.ts                   # Centralised key name functions
│   │
│   ├── api/
│   │   ├── server.ts                 # Fastify instance setup
│   │   ├── plugins/
│   │   │   ├── sensible.ts
│   │   │   └── swagger.ts
│   │   └── routes/
│   │       ├── sports.routes.ts
│   │       ├── events.routes.ts
│   │       ├── admin.routes.ts
│   │       └── health.routes.ts
│   │
│   ├── types/
│   │   ├── odds-api.types.ts         # Raw Odds API response shapes
│   │   ├── internal.types.ts         # Normalised internal types
│   │   └── message.types.ts          # OddsDelta — Redis publish contract
│   │
│   └── main.ts                       # Boot sequence
│
├── tests/
│   ├── unit/
│   │   ├── diff.engine.test.ts
│   │   └── normaliser.test.ts
│   └── integration/
│       ├── poller.test.ts
│       └── publisher.test.ts
│
├── .env.example
├── .env
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 4. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Sport {
  key          String        @id
  group        String
  title        String
  description  String?
  active       Boolean       @default(true)
  hasOutrights Boolean       @default(false)
  updatedAt    DateTime      @updatedAt
  events       Event[]
  config       SportConfig?
}

// Tracks what we are actively polling
model SportConfig {
  id        Int      @id @default(autoincrement())
  sportKey  String   @unique
  sport     Sport    @relation(fields: [sportKey], references: [key])
  regions   String[] // ["uk", "eu"]
  markets   String[] // ["h2h", "spreads"]
  enabled   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id           String         @id
  sportKey     String
  sport        Sport          @relation(fields: [sportKey], references: [key])
  homeTeam     String
  awayTeam     String
  commenceTime DateTime
  status       EventStatus    @default(PRE_MATCH)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  odds         OddsSnapshot[]

  @@index([sportKey])
  @@index([commenceTime])
  @@index([status])
}

enum EventStatus {
  PRE_MATCH
  LIVE
  SETTLED
}

model OddsSnapshot {
  id          BigInt   @id @default(autoincrement())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  bookmaker   String
  market      String
  outcome     String
  price       Decimal  @db.Decimal(10, 4)
  prevPrice   Decimal? @db.Decimal(10, 4)
  point       Decimal? @db.Decimal(6, 2)
  impliedProb Decimal  @db.Decimal(6, 4)
  overround   Decimal  @db.Decimal(6, 4)
  moved       String   // "up" | "down" | "new"
  capturedAt  DateTime @default(now())

  @@index([eventId, capturedAt])
  @@index([capturedAt])
  @@index([bookmaker, market])
}
```

---

## 5. Redis Key Design

```typescript
// src/redis/keys.ts

export const keys = {
  // Previous snapshot for diff comparison
  snapshot: (eventId: string) => `odds:snap:${eventId}`,

  // BullMQ queue names
  queue: {
    poll: 'odds:poll',
  },

  // Quota tracking
  quota: {
    remaining: 'odds:quota:remaining',
    used:      'odds:quota:used',
    resetAt:   'odds:quota:reset_at',
  },

  // Pub/Sub channels (published TO by odds-server, subscribed BY nestjs)
  channel: (sportKey: string) => `odds:${sportKey}`,

  // Paused sports set
  paused: 'odds:paused',
}
```

**Two ioredis connections are required:**
- `redisClient` — general GET/SET/PUBLISH operations
- `redisSubscriber` — dedicated connection for any internal subscriptions (BullMQ uses its own)

Never use the same connection for both PUBLISH and SUBSCRIBE — ioredis puts a subscribed connection into subscriber-only mode.

---

## 6. Core Module Specs

### 6.1 Scheduler Service

```typescript
// Responsibilities:
// - On startup: load all enabled SportConfigs from DB
// - For each sport: add a repeating BullMQ job with correct interval
// - Dynamically adjust interval based on whether live events exist
// - Watch for new sports added via API and add jobs without restart

// Job priority:
// LIVE events sport    → repeat every 5000ms,  priority: 1
// Pre-match < 2hrs     → repeat every 15000ms, priority: 2
// Pre-match > 2hrs     → repeat every 30000ms, priority: 3

// BullMQ job payload:
interface PollJobData {
  sportKey: string
  regions:  string[]
  markets:  string[]
}
```

### 6.2 Poller Worker

```typescript
// Responsibilities:
// - Process BullMQ jobs
// - Call Odds API client
// - Extract quota headers and update Quota Guard
// - Pass raw response to Diff Engine
// - On 429: do not retry immediately, back off 30s
// - On 5xx: retry with exponential backoff, max 3 attempts

// Concurrency: 3 workers max (don't hammer the API)
```

### 6.3 Odds API Client

```typescript
// Axios instance with:
// - baseURL: https://api.the-odds-api.com
// - timeout: 10000ms
// - Response interceptor:
//     → extracts x-requests-remaining, x-requests-used, x-requests-last
//     → calls quotaGuard.update(remaining, used)
// - Request interceptor:
//     → calls quotaGuard.check() — throws PausedError if credits too low
```

### 6.4 Diff Engine

```typescript
// Pure function — no I/O, no side effects
// Input:  previous OddsApiResponse | null, current OddsApiResponse
// Output: OddsDelta[]

// Algorithm:
// For each bookmaker → market → outcome in current response:
//   Find matching outcome in previous snapshot
//   If not found:         emit delta with moved: "new"
//   If price changed:     emit delta with moved: price > prev ? "up" : "down"
//   If price unchanged:   skip (do not emit)
//
// Comparison key: `${bookmaker}:${market}:${outcome}`
// Price comparison: Math.abs(curr - prev) > 0.0001 (float tolerance)
```

### 6.5 Normaliser

```typescript
// Pure function — no I/O
// Input:  raw OddsDelta (price only)
// Output: enriched OddsDelta (+ impliedProb, overround, moved)

// impliedProb = 1 / decimalPrice
// overround   = sum of all implied probs in a market
//               e.g. Arsenal: 2.0 (0.5) + Chelsea: 3.0 (0.333) + Draw: 4.0 (0.25)
//               overround = 1.083 (8.3% margin)
```

### 6.6 Redis Publisher

```typescript
// This is the hot path — must be as fast as possible
// 
// Steps (in order):
// 1. PUBLISH `odds:{sportKey}` JSON.stringify(deltas)   ← awaited
// 2. SET `odds:snap:{eventId}` snapshot JSON            ← awaited (needed for next diff)
// 3. DB write (bulkInsert odds_snapshots)               ← NOT awaited, fire & forget
// 4. DB upsert events                                   ← NOT awaited, fire & forget
//
// NEVER put DB writes before or blocking the PUBLISH.
// If DB is down, odds still flow. Log the error, retry later.
```

---

## 7. Fastify API Spec

### Sports Routes

```
POST   /sports
Body:  { key: string, regions: string[], markets: string[] }
→ Upserts SportConfig in DB, triggers scheduler to add job
→ 201 Created

GET    /sports
→ Returns all SportConfig rows with enabled status
→ 200 OK

PATCH  /sports/:key
Body:  { regions?: string[], markets?: string[], enabled?: boolean }
→ Updates SportConfig, restarts job if needed
→ 200 OK

DELETE /sports/:key
→ Removes SportConfig, removes BullMQ job
→ 204 No Content
```

### Events Routes

```
GET    /events/:sportKey
Query: ?status=live|pre_match|all  (default: all)
Query: ?limit=50&offset=0
→ Returns events from DB
→ 200 OK

GET    /events/:sportKey/live
→ Shorthand for status=live
→ 200 OK
```

### Admin Routes

```
POST   /admin/pause/:sportKey
→ Adds sportKey to Redis paused set, Quota Guard checks this
→ 200 OK

POST   /admin/resume/:sportKey
→ Removes from paused set
→ 200 OK

POST   /admin/force-poll/:sportKey
→ Adds immediate high-priority BullMQ job
→ 202 Accepted

GET    /quota
→ Returns { remaining, used, resetAt } from Redis
→ 200 OK
```

### Health Routes

```
GET    /health
→ Checks Redis ping + Prisma $queryRaw SELECT 1
→ 200 { status: "ok", redis: "ok", db: "ok" }
→ 503 if either fails

GET    /metrics
→ Prometheus text format
→ Counters: odds_polls_total, odds_publish_total, odds_deltas_total
→ Gauges:   quota_remaining, active_sports, active_events
→ Histograms: poll_duration_ms, publish_duration_ms
```

---

## 8. Environment Variables

```bash
# .env.example

# Odds API
ODDS_API_KEY=your_key_here
ODDS_API_BASE_URL=https://api.the-odds-api.com

# Redis (shared with NestJS)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Postgres
DATABASE_URL=postgresql://user:pass@localhost:5432/odds_server

# Server
PORT=3001
NODE_ENV=development

# Quota safety thresholds
QUOTA_PAUSE_THRESHOLD=50      # pause non-live polls below this
QUOTA_HALT_THRESHOLD=10       # pause ALL polls below this

# Polling intervals (ms)
POLL_INTERVAL_LIVE=5000
POLL_INTERVAL_SOON=15000      # < 2hrs to commence
POLL_INTERVAL_PREMATCH=30000

# BullMQ
BULL_CONCURRENCY=3
```

---

## 9. Boot Sequence

```
main.ts:
  1. Validate all env vars (zod) → crash fast if invalid
  2. Connect ioredis — wait for ready event
  3. Connect Prisma — run $connect()
  4. Run pending Prisma migrations
  5. Load enabled SportConfigs from DB
  6. Start Fastify server on PORT
  7. Start BullMQ workers (concurrency: BULL_CONCURRENCY)
  8. Start Scheduler — enqueue jobs for each loaded sport
  9. Log "Odds server ready" with sport count
```

---

## 10. Error Handling Strategy

| Scenario | Behaviour |
|---|---|
| Odds API 429 | Back off 30s, do not retry, log warning, decrement quota cache |
| Odds API 5xx | Exponential backoff: 1s, 2s, 4s — then dead-letter job |
| Odds API empty response | Skip diff, do not count against quota |
| Redis publish fails | Log error, retry once after 100ms |
| Redis down entirely | BullMQ jobs fail, scheduler pauses, logs alert. Reconnects automatically via ioredis |
| Postgres down | DB writes fail silently (logged), publish path unaffected |
| Diff engine throws | Log + skip this cycle, do not publish partial data |

---

## 11. Docker Compose (Development)

```yaml
# docker-compose.yml
version: "3.9"

services:
  odds-server:
    build: .
    ports:
      - "3001:3001"
    environment:
      - REDIS_HOST=redis
      - DATABASE_URL=postgresql://odds:odds@postgres:5432/odds
    depends_on:
      - redis
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --save 60 1

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: odds
      POSTGRES_PASSWORD: odds
      POSTGRES_DB: odds
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 12. Performance Considerations

**Hot path must be synchronous (no await except Redis PUBLISH):**
```
fetch response (async, awaited) 
  → diff (sync, ~1ms, pure RAM)
  → normalise (sync, ~0.5ms, pure RAM)
  → PUBLISH (async, awaited, ~0.2ms local Redis)
  → snapshot SET (async, awaited)
  → DB write (async, NOT awaited)

Total hot path target: < 5ms after response received
```

**Avoid JSON.parse/stringify bottleneck:**
- Keep the raw API response as a JS object through the entire pipeline
- Only stringify once at the PUBLISH call
- Use `Buffer` if message size grows large

**BullMQ job granularity:**
- One job per sport, not one job per event
- Fetch all events for a sport in one API call
- Diff all events in one pass

**Redis pipeline for snapshot writes:**
- When multiple events change in one poll cycle, use `redis.pipeline()` to SET all snapshots in one round trip
