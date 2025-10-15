# Gap Casino Backend

## Overview

This is the backend service for the Gap Casino, designed as a microservice that works alongside a separate User service.

## Architecture

This service implements a reference-only entity pattern where it maintains minimal User information locally while communicating with the main User service for complete user data.

See [MICROSERVICE_ARCHITECTURE.md](MICROSERVICE_ARCHITECTURE.md) for detailed architecture documentation.

## Setup

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database
- User service running on a separate port (default: 3001)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` and configure the variables:
   ```bash
   cp .env.example .env
   ```

3. Run database migrations:
   ```bash
   npm run migration:run
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Environment Variables

- `PORT`: Port for the Gap Casino service (default: 3005)
- `USER_SERVICE_URL`: URL for the User microservice (default: http://localhost:3001)
- `DB_*`: Database configuration variables
- `STUDIO21_*`: Studio 21 integration configuration
- `GAP_CASINO_*`: Gap Casino integration configuration

## Running with Docker

To run both services together using Docker Compose:

```bash
docker-compose up --build
```

This will start:
- User service on port 3001
- Gap Casino service on port 3005
- Separate databases for each service

## API Endpoints

### Casino Games
- `GET /gap-casino-game/providers/all` - Get all games grouped by provider
- `GET /gap-casino-game/providers/batch` - Get games in batches
- `POST /gap-casino-game/url` - Get game URL for a specific game

### User Operations
- `POST /gap-casino-game/balance` - Get user balance
- `POST /gap-casino-game/bet` - Place a bet
- `POST /gap-casino-game/result` - Process game result
- `POST /gap-casino-game/rollback` - Rollback a transaction

## Development

### Code Structure

- `src/modules/games/` - Casino game functionality
- `src/modules/users/` - Minimal user entity and service for communication with User service
- `src/common/utils/` - Utility functions and services

### Testing

Run unit tests:
```bash
npm run test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request