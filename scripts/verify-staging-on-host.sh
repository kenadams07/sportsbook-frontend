#!/usr/bin/env bash
set -euo pipefail

APP_PATH="${APP_PATH:-/home/ubuntu/sportsbook-backend}"
ENV_FILE="${ENV_FILE:-.env.staging}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.staging.yml}"

cd "$APP_PATH"

echo "== Docker Compose status =="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo
echo "== Local user API health =="
curl --fail --silent --show-error "http://127.0.0.1:3001/health"
echo

echo
echo "== Local odds API health =="
curl --fail --silent --show-error "http://127.0.0.1:3003/health"
echo

echo
echo "== Recent odds-server logs =="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail 80 odds-server

echo
echo "== Recent user-server logs =="
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail 80 user-server