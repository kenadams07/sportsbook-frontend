# Sportsbook Docker Services

This project contains a microservices architecture for a sportsbook application using Docker.

## Services

1. **User Service** - Port 3001
2. **Admin Service** - Port 3002
3. **Match Odds Service** - Port 3003
4. **PostgreSQL Database** - Port 5432
5. **Redis** - Port 6379
6. **RabbitMQ** - Ports 5672 (AMQP), 15672 (Management)

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Environment Configuration

This project now uses environment variables for configuration. Before starting the services, you need to set up your environment:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Modify the values in `.env` to match your environment (see [ENVIRONMENT.md](ENVIRONMENT.md) for details)

### Starting All Services

#### Using Docker Compose (Recommended)
```bash
# Start all services in detached mode
docker-compose up -d

# View logs for a specific service
docker-compose logs user-service

# Stop all services
docker-compose down
```

#### Using Convenience Scripts
- On Windows: Run `start-services.bat`
- On Unix-like systems: Run `./start-services.sh`

### Environment Variables

All services use standardized environment variables from the `.env` file:

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: 1478)
- `DB_NAME` - Database name (default: sportsbook)
- `REDIS_URL` - Redis connection URL
- `RABBITMQ_URL` - RabbitMQ connection URL
- `JWT_SECRET` - JWT secret key
- `PORT` - Service port

For a complete list of environment variables and best practices, see [ENVIRONMENT.md](ENVIRONMENT.md).

### Development vs Production

- `docker-compose.yml` - Base configuration using environment variables
- `docker-compose.override.yml` - Local development overrides
- For production, use `.env.production` as a template for your production environment

## Service Endpoints

- User Service: http://localhost:3001
- Admin Service: http://localhost:3002
- Match Odds Service: http://localhost:3003
- RabbitMQ Management: http://localhost:15672 (guest/guest)

## Troubleshooting

If services fail to start:
1. Ensure Docker is running
2. Check that required ports are not in use
3. Verify environment variables in .env files
4. Check Docker logs: `docker-compose logs [service-name]`