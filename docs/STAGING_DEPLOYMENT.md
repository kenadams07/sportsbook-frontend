# Staging Deployment

## Services

- https://xfair91.com: user frontend
- https://user-api.xfair91.com: user-server through the ALB target group
- https://odds-api.xfair91.com: odds-server through the ALB target group

PostgreSQL and Redis remain private inside the Docker network. Do not publish their ports.

## First Deployment

1. Copy .env.staging.example to .env.staging on the server and replace every placeholder.
2. Run docker compose --env-file .env.staging -f docker-compose.staging.yml up -d --build.
3. Run docker compose --env-file .env.staging -f docker-compose.staging.yml ps.
4. Check http://127.0.0.1:3020/health and http://127.0.0.1:3010/health from the VPS.
5. Configure the existing HTTPS reverse proxy to forward each API domain to its local port. The odds upstream must forward WebSocket upgrade headers.

## Updating

Run git pull, then run the same docker compose command. The migrate service uses prisma migrate deploy, so already-applied migrations are not rerun.

## Rollback

Deploy the last known-good git commit and run the compose command again. Do not roll database migrations backward casually; migrations must stay backward-compatible for at least one release.