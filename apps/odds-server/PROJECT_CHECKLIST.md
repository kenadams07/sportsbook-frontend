# Odds Server Project Checklist

Use this as the working sync file while building the service step by step.

## Phase 0 - Project Foundation

- [x] Initialize Node + TypeScript project
- [x] Install core dependencies
- [x] Configure `tsconfig.json`
- [x] Configure `.env` and `.env.example`
- [x] Add Docker Compose for Redis and Postgres
- [x] Fix local Postgres port conflict by mapping Docker Postgres to host `5433`
- [x] Add Prisma schema
- [x] Apply initial Prisma migration
- [x] Add Prisma client singleton
- [x] Add Redis client and subscriber connections
- [x] Add env validation with Zod
- [x] Add main boot sequence
- [x] Add Fastify server
- [x] Add `/health`
- [x] Add MVC-style API folder structure
- [x] Add `/quota`

## Phase 1 - Odds API Client

- [x] Add Odds API response types
- [x] Add quota Redis keys
- [x] Add quota update helper
- [x] Add Axios Odds API client
- [x] Add response interceptor to store quota headers
- [x] Add request interceptor to block requests when quota is too low
- [x] Add `getSports()`
- [x] Test `getSports()` against real API
- [x] Add `getEvents(sportKey)`
- [x] Test `getEvents()` against real API
- [x] Add `getOdds(sportKey, regions, markets)`
- [x] Test `getOdds()` with a low-cost call
- [x] Improve quota guard to distinguish free endpoints from paid odds endpoints
- [ ] Store additional quota header fields if needed, such as last request cost
- [x] Add cleaner API error handling for 401, 404, 429, and 5xx responses

## Phase 2 - Processing Layer

- [x] Add internal delta types
- [x] Add diff engine
- [x] Add normaliser
- [x] Add unit tests for diff engine
- [x] Add unit tests for normaliser
- [x] Verify processing tests pass
- [x] Add snapshot store for Redis `GET`/`SET` with TTL
- [x] Add a small manual processing flow: previous snapshot + current odds -> deltas

## Phase 3 - Publisher + Hot Path

- [x] Add Redis publisher
- [x] Publish deltas to `odds:{sportKey}`
- [x] Store current snapshots in Redis as `odds:snap:{eventId}` with TTL
- [ ] Use Redis pipeline for batch snapshot writes
- [x] Ensure DB writes are fire-and-forget and never block publish
- [x] Add a `processPollResult()` function for fetch -> diff -> normalise -> publish
- [x] Manually test Redis Pub/Sub receives odds deltas
- [x] Skip real Odds API polling when no frontend/WebSocket subscriber is watching that sport

## Phase 4 - Database Repositories

- [x] Add sport repository
- [x] Add event repository
- [x] Add odds snapshot repository
- [x] Upsert sports from Odds API
- [x] Upsert events from Odds API
- [x] Insert odds snapshot history
- [x] Mark events as `LIVE` when `commence_time < now`
- [ ] Improve event status lifecycle to avoid stale `PRE_MATCH` rows for old events
- [x] Keep odds history inserts delta-only, not full snapshots every poll
- [x] Preserve DB write order: sport before event before odds snapshots
- [ ] Consider transaction-aware repository design for dependent DB writes
- [x] Wire DB persistence after Redis publish as fire-and-forget
- [x] Smoke test DB persistence with real odds deltas
- [x] Add `sportKey` to `OddsSnapshot` for sport-level time-series queries

## Phase 5 - Scheduler + Workers

- [x] Add BullMQ queue
- [x] Add poller worker
- [x] Manually test BullMQ job processing
- [x] Use BullMQ queue name without `:` separators
- [x] Add scheduler service
- [x] Manually test scheduler repeat jobs
- [x] Load enabled sport configs from DB on startup
- [ ] Add adaptive intervals: live, soon, prematch
- [ ] Pause polling when quota is low
- [x] Avoid scheduled real API polling when there are no active subscribers for the sport
- [x] Retry failed poll jobs with exponential backoff
- [x] Treat quota pause as skipped job instead of failed job

## Phase 6 - Admin API

- [x] Add sports routes
- [x] Add sports controller
- [x] Add sports service
- [x] Add create/update/delete SportConfig
- [x] Add `pollIntervalMs` override to SportConfig
- [x] Add events routes
- [x] Add admin pause/resume routes
- [x] Add force-poll route
- [x] Add admin event status override route
- [x] Add admin event status override release route
- [x] Make paused sports skip poll processing
- [ ] Add route schemas/validation
- [x] Add route schemas/validation for sports and events APIs
- [x] Add SportCategory layer for category-level admin sports such as Soccer, Cricket, and Tennis
- [x] Add admin flow to sync sport categories without enabling all leagues
- [x] Add selected-league bulk add/configure API with regions, markets, and poll interval
- [x] Add admin event restore API to bulk-create markets and outcomes for selected/all events
- [x] Rename Prisma domain models to production naming: `Sport` for category, `League` for competition, `LeagueConfig` for polling config

## Phase 7 - Observability + Hardening

- [x] Add basic Prometheus metrics
- [x] Add `/metrics`
- [x] Add structured logs for poll, diff, publish, and persist failures
- [x] Add browser debug stream for live Redis odds deltas
- [x] Add WebSocket odds stream endpoint for frontend subscriptions
- [x] Track WebSocket subscriber counts per sport in Redis
- [x] Add frontend-compatible events endpoint backed by odds-server data
- [x] Add dev-only fake odds publisher with Redis snapshots and WebSocket deltas
- [x] Seed local test sport configs and events for baseball, basketball, cricket, soccer, and tennis
- [x] Improve error logging so async failures show useful error details
- [ ] Add structured logs for quota updates/checks
- [x] Add graceful shutdown for Fastify, Redis, Prisma, and BullMQ
- [x] Add unhandled rejection and uncaught exception handling
- [ ] Test Redis disconnect/reconnect behavior
- [ ] Test Postgres disconnect does not block publish path

## Phase 8 - Integration

- [ ] Share `OddsDelta` contract with NestJS backend
- [ ] Confirm Redis channel naming with NestJS backend
- [ ] Smoke test NestJS subscription to `odds:{sportKey}`
- [x] Add CORS support for direct frontend access to odds-server APIs
- [x] Confirm frontend receives direct odds-server WebSocket deltas
- [x] Wire frontend event list to odds-server `/frontend/events/:sportKey`
- [x] Wire admin Restore panel to category -> selected leagues -> event sync flow
- [x] Add Restore panel actions for selected/all event market/outcome restore
- [x] Remove old match-odds-service/frontend HTTP fallback polling for odds
- [x] Stop frontend `/health` polling
- [x] Add WebSocket reconnect/resubscribe behavior after odds-server restart
- [x] Improve frontend live odds display and movement highlight styling
- [ ] Confirm frontend receives forwarded odds deltas if we later put NestJS back in the middle

## Phase 9 - Final Cleanup

- [x] Add README setup instructions
- [x] Add API reference to README
- [x] Add `.env.example` documentation
- [ ] Review all `any` usage
- [ ] Review all catch blocks
- [x] Add unit tests for event status resolver
- [x] Add unit tests for scores status sync and admin status control service
- [x] Smoke test health, debug page, sport config, and force-poll route locally
- [ ] Evaluate market-level polling interval controls
- [ ] Evaluate event-level polling only if sport-level API becomes insufficient
- [x] Evaluate TimescaleDB for `OddsSnapshot` time-series storage
- [x] If using TimescaleDB, convert `OddsSnapshot` to a hypertable on `capturedAt`
- [x] If using TimescaleDB, add 30-day retention policy for old odds history
- [x] If using TimescaleDB, add compression policy for older odds chunks
- [ ] Add admin controls for sport/event/market-level polling latency strategy
- [ ] Add production-safe fake odds toggle documentation
- [ ] Add manual smoke-test commands for WebSocket subscriber count and no-subscriber skip
- [ ] Add CI build/test workflow
- [ ] Add Dockerfile
- [ ] Add production Docker Compose

## Current Next Step

- [x] Wire worker lifecycle into `main.ts`
- [x] Defer adaptive intervals behind admin-configurable `pollIntervalMs`
- [x] Add demand-aware polling guard so real Odds API calls happen only when subscribers exist
- [x] Add compression policy for TimescaleDB odds history
- [ ] Add admin-facing polling strategy controls
- [ ] Add production deployment hardening: Dockerfile, CI, env docs, and smoke-test checklist
