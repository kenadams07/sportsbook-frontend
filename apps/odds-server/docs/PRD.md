# PRD — Odds Server
**Version:** 1.0  
**Status:** Draft  
**Author:** Aman  
**Date:** 2026-06-05

---

## 1. Overview

The Odds Server is an internal microservice responsible for two things only:

1. **Fetching and distributing** real-time sports odds from The Odds API to the existing NestJS backend via Redis Pub/Sub.
2. **Persisting** sports hierarchy data (sports, events, bookmakers, odds history) to PostgreSQL.

It is not user-facing. It has no authentication layer for end users. It exposes a Fastify HTTP API purely for internal configuration and observability.

---

## 2. Problem Statement

The existing NestJS backend + frontend need live odds data. Directly integrating The Odds API into the NestJS backend would:

- Couple business logic with data ingestion
- Make quota management and polling logic hard to maintain
- Create a single point of failure for odds data across all consumers

A dedicated odds server decouples ingestion from distribution and gives full control over polling strategy, quota management, and data normalization.

---

## 3. Goals

| # | Goal |
|---|---|
| G1 | Deliver odds updates to NestJS backend with sub-100ms latency from API response |
| G2 | Never exceed The Odds API quota — protect credits at all times |
| G3 | Only publish odds when something actually changed (diff before publish) |
| G4 | Persist all sports hierarchy data and odds history to PostgreSQL |
| G5 | Allow dynamic configuration of tracked sports, regions, and markets via REST API |
| G6 | Be fully observable — health, quota status, and metrics always accessible |

---

## 4. Non-Goals

- No end-user authentication or authorization
- No WebSocket server (NestJS backend owns client connections)
- No frontend or UI
- No bet placement, settlement, or user account logic
- No real-time scores (can be added later)

---

## 5. Users / Consumers

| Consumer | How they interact |
|---|---|
| NestJS Backend | Subscribes to Redis channel `odds:{sport_key}`, receives delta messages |
| DevOps / Developer | Calls Fastify admin API to configure sports, check quota, pause polling |
| Monitoring | Scrapes `/metrics` Prometheus endpoint |

---

## 6. Functional Requirements

### 6.1 Sports Configuration API (Fastify)

| ID | Requirement |
|---|---|
| F1 | `POST /sports` — add a sport to track with regions and markets |
| F2 | `DELETE /sports/:key` — remove a sport from tracking |
| F3 | `GET /sports` — list all tracked sports with their config |
| F4 | `PATCH /sports/:key` — update regions/markets for a sport |
| F5 | `GET /events/:sportKey` — list events for a sport from DB |
| F6 | `GET /events/:sportKey/live` — list only currently live events |

### 6.2 Ingestion

| ID | Requirement |
|---|---|
| F7 | Poll The Odds API for each tracked sport on a configurable interval |
| F8 | Live events (commence_time < now) must poll at 5s interval |
| F9 | Pre-match events within 2 hours must poll at 15s interval |
| F10 | All other pre-match events poll at 30s interval |
| F11 | If `x-requests-remaining` drops below 50, pause non-live polls |
| F12 | If `x-requests-remaining` drops below 10, pause all polls and alert |
| F13 | Retry failed API calls with exponential backoff (max 3 retries) |

### 6.3 Processing

| ID | Requirement |
|---|---|
| F14 | Compare each API response against the previous snapshot in Redis |
| F15 | Only process and publish outcomes where price or point has changed |
| F16 | Compute implied probability for each outcome |
| F17 | Compute overround (book margin) per market |
| F18 | Flag each changed outcome as `moved: "up" | "down" | "new"` |

### 6.4 Publishing

| ID | Requirement |
|---|---|
| F19 | Publish changed outcomes to Redis channel `odds:{sport_key}` |
| F20 | Publish payload must conform to the `OddsDelta[]` contract |
| F21 | DB write must be async and must never block the publish |
| F22 | Store current odds snapshot in Redis with TTL 60s as `odds:snap:{eventId}` |

### 6.5 Persistence

| ID | Requirement |
|---|---|
| F23 | Upsert sport records on every poll cycle |
| F24 | Upsert event records (id, teams, commence_time, status) |
| F25 | Insert odds snapshots to `odds_snapshots` table for history |
| F26 | Update event `status` to `live` when commence_time < now |

### 6.6 Observability

| ID | Requirement |
|---|---|
| F27 | `GET /health` — returns 200 if Redis and Postgres are reachable |
| F28 | `GET /quota` — returns current credit usage from Redis cache |
| F29 | `GET /metrics` — Prometheus format: poll count, publish count, quota remaining, lag |
| F30 | `POST /admin/pause/:sportKey` — pause polling for a specific sport |
| F31 | `POST /admin/resume/:sportKey` — resume polling |
| F32 | `POST /admin/force-poll/:sportKey` — trigger immediate poll outside schedule |

---

## 7. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NF1 | Poll → diff → publish pipeline must complete in under 50ms (P99) |
| NF2 | Redis publish latency must be under 5ms (P99) on local network |
| NF3 | Service must recover from Redis disconnect and reconnect automatically |
| NF4 | Service must recover from Postgres disconnect without losing publish path |
| NF5 | No odds update should be lost due to a DB write failure |
| NF6 | Memory usage must stay under 512MB under normal load |
| NF7 | All configuration must be via environment variables or DB — no hardcoded values |

---

## 8. Redis Message Contract

**Channel:** `odds:{sport_key}` (e.g. `odds:soccer_epl`)

```typescript
interface OddsDelta {
  eventId:      string        // "bda33adc..."
  sportKey:     string        // "soccer_epl"
  homeTeam:     string        // "Arsenal"
  awayTeam:     string        // "Chelsea"
  commenceTime: string        // ISO 8601
  bookmaker:    string        // "betfair"
  market:       string        // "h2h" | "spreads" | "totals"
  outcome:      string        // "Arsenal"
  price:        number        // 2.45 (always decimal)
  prevPrice:    number | null // null if new outcome
  point:        number | null // spreads/totals only
  impliedProb:  number        // 0.408
  overround:    number        // 1.045
  moved:        "up" | "down" | "new"
  ts:           number        // Unix ms timestamp
}
```

The NestJS backend subscribes to this channel and forwards to frontend clients. The odds server's responsibility ends at `PUBLISH`.

---

## 9. Out of Scope (v1)

- Scores / live score tracking
- Historical odds querying API
- Outright / futures markets
- Player prop markets
- Multiple odds formats (always publish decimal; NestJS converts if needed)
- Webhooks
- Multi-region deployment

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Publish latency (poll response → Redis PUBLISH) | < 50ms P99 |
| Quota overage incidents | 0 |
| Missed polls due to errors | < 0.1% |
| Uptime | 99.9% |
