#!/usr/bin/env bash
set -euo pipefail

ODDS_API_URL="${ODDS_API_URL:-https://odds-api.xfair91.com}"
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-https://xfair91.com}"
ATTEMPTS="${ATTEMPTS:-20}"
TARGET_GROUP_ARN="${TARGET_GROUP_ARN:-}"

echo "== Repeated public health check =="
failures=0

for ((attempt = 1; attempt <= ATTEMPTS; attempt++)); do
  status="$(curl --silent --show-error --output /dev/null --write-out "%{http_code}" \
    --header "Origin: ${FRONTEND_ORIGIN}" \
    "${ODDS_API_URL}/health" || true)"

  printf "Attempt %02d: %s\n" "$attempt" "${status:-000}"

  if [[ "$status" != "200" ]]; then
    failures=$((failures + 1))
  fi
done

echo
echo "== CORS response headers =="
curl --silent --show-error --head \
  --header "Origin: ${FRONTEND_ORIGIN}" \
  "${ODDS_API_URL}/health" \
  | grep -Ei "HTTP/|access-control-allow-origin|server" || true

echo
echo "== Odds endpoint response headers =="
curl --silent --show-error --head \
  --header "Origin: ${FRONTEND_ORIGIN}" \
  "${ODDS_API_URL}/frontend/sports/soccer/leagues" \
  | grep -Ei "HTTP/|access-control-allow-origin|server" || true

if [[ -n "$TARGET_GROUP_ARN" ]]; then
  echo
  echo "== AWS target group health =="
  aws elbv2 describe-target-health \
    --target-group-arn "$TARGET_GROUP_ARN" \
    --query "TargetHealthDescriptions[].{Target:Target.Id,Port:Target.Port,State:TargetHealth.State,Reason:TargetHealth.Reason,Description:TargetHealth.Description}" \
    --output table
fi

if [[ "$failures" -gt 0 ]]; then
  echo
  echo "FAILED: ${failures}/${ATTEMPTS} public health checks were not HTTP 200."
  echo "Check the ALB target group for stale or unhealthy targets."
  exit 1
fi

echo
echo "PASS: every public health check returned HTTP 200."