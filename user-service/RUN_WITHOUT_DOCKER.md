# Running User Service Without Docker

This guide explains how to run the user service without Docker while preserving the current structure.

## Prerequisites

1. Node.js installed (version 18 or higher)
2. PostgreSQL database
3. Redis server
4. RabbitMQ server

## Option 1: Using Local Infrastructure Services

### 1. Install Infrastructure Services

Install PostgreSQL, Redis, and RabbitMQ on your local machine:
- PostgreSQL: https://www.postgresql.org/download/
- Redis: https://redis.io/download/
- RabbitMQ: https://www.rabbitmq.com/download.html

### 2. Configure Environment Variables

Update your [.env](file:///c%3A/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/.env) file in the user-service directory with your local service addresses:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASS=your_postgres_password
DB_NAME=sportsbook
DATABASE_URL=postgres://your_postgres_username:your_postgres_password@localhost:5432/sportsbook
DB_AUTO_LOAD_ENTITIES=true
DB_SYNCHRONIZE=true

# Application Configuration
PORT=3001

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Email Configuration (optional)
SMTP_HOST=email-smtp.eu-west-2.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_MAIL=info@moneyplantfx.com
 
# Frontend URL
FRONTEND_URL=http://localhost:5002
```

### 3. Install Dependencies

Navigate to the user-service directory and install dependencies:

```bash
cd user-service
npm install
```

### 4. Run the Service

Start the service in development mode:

```bash
npm run start:dev
```

The service will be available at http://localhost:3001

## Option 2: Using External Services

If you prefer to use cloud-hosted services:

1. Update the [.env](file:///c%3A/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/.env) file with your external service addresses:
   - Database connection details
   - Redis connection details
   - RabbitMQ connection details

2. Install dependencies:
   ```bash
   cd user-service
   npm install
   ```

3. Run the service:
   ```bash
   npm run start:dev
   ```

## Available Scripts

- `npm run start`: Runs the app
- `npm run start:dev`: Runs the app in development mode with hot reloading
- `npm run start:debug`: Runs the app in debug mode
- `npm run start:prod`: Runs the app in production mode

## Troubleshooting

1. **Database Connection Issues**: Ensure PostgreSQL is running and the credentials in [.env](file:///c%3A/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/.env) are correct.

2. **Redis Connection Issues**: Ensure Redis is running and accessible on the configured host and port.

3. **RabbitMQ Connection Issues**: Ensure RabbitMQ is running and the credentials in [.env](file:///c%3A/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/.env) are correct.

4. **Port Conflicts**: If port 3001 is already in use, change the PORT value in [.env](file:///c%3A/Users/hp/Desktop/Repos/Sportsbook-User/Sportsbook-backend/user-service/.env).