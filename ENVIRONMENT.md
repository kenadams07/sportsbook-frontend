# Environment Configuration

This document explains how environment variables are used in this project and best practices for managing them.

## Overview

The project uses environment variables for configuration to ensure consistency across different environments (development, staging, production) and to follow security best practices by externalizing sensitive configuration.

## Configuration Files

### .env
The main environment file containing all configuration variables. This file is used by default in all environments.

### .env.example
A template file showing all available environment variables with example or placeholder values. This should be copied to `.env` and customized for your environment.

### .env.production
A template for production environment variables. In a real production deployment, these values would be set through your deployment platform's secret management system rather than committed to the repository.

## Environment Variables

### Database Configuration
- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: 1478)
- `DB_NAME` - Database name (default: sportsbook)
- `DB_AUTO_LOAD_ENTITIES` - Auto-load database entities (default: true)
- `DB_SYNCHRONIZE` - Database synchronization (default: true)

### Redis Configuration
- `REDIS_URL` - Redis connection URL (default: redis://redis:6379)

### RabbitMQ Configuration
- `RABBITMQ_DEFAULT_USER` - RabbitMQ username (default: guest)
- `RABBITMQ_DEFAULT_PASS` - RabbitMQ password (default: guest)
- `RABBITMQ_URL` - RabbitMQ connection URL
- `RABBITMQ_QUEUE_USER` - User service queue name
- `RABBITMQ_QUEUE_ADMIN` - Admin service queue name
- `RABBITMQ_QUEUE_ODDS` - Match odds service queue name

### JWT Configuration
- `JWT_SECRET` - JWT secret key
- `TOKEN_EXPIRESIN` - Token expiration time

### Service Ports
- `USER_SERVICE_PORT` - User service port (default: 3001)
- `ADMIN_SERVICE_PORT` - Admin service port (default: 3002)
- `MATCH_ODDS_SERVICE_PORT` - Match odds service port (default: 3003)
- `SOCKET_PORT` - Socket port (default: 4000)

### PostgreSQL Configuration
- `POSTGRES_USER` - PostgreSQL username (default: postgres)
- `POSTGRES_PASSWORD` - PostgreSQL password (default: 1478)
- `POSTGRES_DB` - PostgreSQL database name (default: sportsbook)

## Best Practices

1. **Never commit sensitive data** - The `.env` file is in `.gitignore` to prevent accidental commits of sensitive information.

2. **Use descriptive variable names** - Variable names should clearly indicate their purpose.

3. **Provide sensible defaults** - Use the `${VAR:-default}` syntax in docker-compose.yml to provide fallback values.

4. **Document all variables** - Every environment variable should be documented in this file and included in `.env.example`.

5. **Separate environments** - Use different environment files for different deployment environments.

6. **Validate configuration** - Services should validate required environment variables at startup.

## Docker Compose Configuration

The project uses Docker Compose with environment variable substitution:

```yaml
environment:
  - DB_HOST=${DB_HOST:-postgres}
  - DB_PORT=${DB_PORT:-5432}
```

This syntax allows variables to be overridden from the shell environment while providing sensible defaults.

## Security Considerations

1. Environment variables are not encrypted at rest in the `.env` file.
2. In production, use your platform's secret management system rather than `.env` files.
3. Rotate secrets regularly.
4. Limit access to environment files.
5. Use strong, randomly generated secrets.