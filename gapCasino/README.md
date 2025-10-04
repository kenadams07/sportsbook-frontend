# GapCasino Backend

A NestJS backend for GapCasino, a casino gaming platform.

## Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── common/
├── config/
│   └── database.config.ts
├── database/
│   └── base.entity.ts
├── decorators/
│   └── roles.decorator.ts
├── filters/
│   └── http-exception.filter.ts
├── guards/
│   └── roles.guard.ts
├── interceptors/
│   └── logging.interceptor.ts
├── interfaces/
├── middleware/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── games/
│   │   ├── entities/
│   │   │   └── game.entity.ts
│   ├── bets/
│   │   ├── entities/
│   │   │   └── bet.entity.ts
│   ├── transactions/
│   │   ├── entities/
│   │   │   └── transaction.entity.ts
│   ├── wallet/
│   │   ├── entities/
│   │   │   └── wallet.entity.ts
├── pipes/
│   └── validation.pipe.ts
└── utils/
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm >= 6.x

### Installation

```bash
npm install
```

### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Features

- User authentication with JWT
- User management
- Game management
- Betting system
- Wallet and transaction management
- Role-based access control
- Validation and error handling
- SQLite database with TypeORM

## Modules

### Auth Module
Handles user authentication and authorization.

### Users Module
Manages user accounts and profiles.

### Games Module
Manages casino games and their configurations.

### Bets Module
Handles player betting functionality.

### Transactions Module
Tracks all financial transactions.

### Wallet Module
Manages user wallets and balances.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_PATH=gapcasino.db
```

## Database

This project uses SQLite for development and TypeORM as the ORM. The database schema is automatically synchronized based on the entity definitions.

## API Endpoints

- `/api/users` - User management
- `/api/auth` - Authentication
- `/api/games` - Game management
- `/api/bets` - Betting functionality
- `/api/transactions` - Transaction history
- `/api/wallet` - Wallet management

## License

This project is licensed under the MIT License.