# Studio 21 Integration API Implementation

## Overview

This document provides detailed information about the Studio 21 Integration API implementation. This is a separate implementation from the existing gapCasino system, following the specifications outlined in the Studio 21 Integration API v1.0.8.pdf document.

## Project Structure

```
studio21-integration/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   └── database.config.ts
│   ├── database/
│   │   └── base.entity.ts
│   ├── entities/
│   │   ├── studio21-game.entity.ts
│   │   ├── studio21-transaction.entity.ts
│   │   ├── studio21-user-token.entity.ts
│   │   └── user.entity.ts
│   ├── modules/
│   │   ├── studio21-game.controller.ts
│   │   ├── studio21-game.module.ts
│   │   └── studio21-game.service.ts
│   ├── dto/
│   │   ├── studio21-base.dto.ts
│   │   ├── studio21-balance.dto.ts
│   │   ├── studio21-bet.dto.ts
│   │   ├── studio21-result.dto.ts
│   │   └── studio21-rollback.dto.ts
│   └── utils/
│       ├── signature.module.ts
│       └── signature.service.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Authentication & Game Launch
- `GET /api/studio21-game/game-url` - Retrieve game URL for launching games

### Game Operations
- `POST /api/studio21-game/balance` - Get user balance
- `POST /api/studio21-game/bet` - Place a bet
- `POST /api/studio21-game/result` - Process game result
- `POST /api/studio21-game/rollback` - Rollback a transaction

## Entity Models

### Studio21Game
Represents a game in the Studio 21 system:
- `id`: UUID (Primary Key)
- `gameId`: String identifier for the game
- `name`: Game name
- `gameCode`: Unique game code
- `category`: Game category
- `providerName`: Game provider name
- `subProviderName`: Sub-provider name
- `urlThumb`: Thumbnail URL
- `status`: Boolean indicating if game is active
- `token`: Authentication token
- `rtp`: Return to Player percentage
- `volatility`: Game volatility level
- `description`: Game description
- `tags`: Comma-separated tags
- `features`: Game features
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Studio21Transaction
Represents a financial transaction:
- `id`: UUID (Primary Key)
- `userId`: Reference to user
- `gameId`: Reference to game
- `roundId`: Game round identifier
- `txnId`: Transaction identifier
- `reqId`: Request identifier
- `stake`: Amount staked
- `pl`: Profit/Loss amount
- `prevBalance`: Balance before transaction
- `postBalance`: Balance after transaction
- `currency`: Currency information (code and value)
- `status`: Transaction status (OPEN, SETTLED, ROLLBACK, CANCELLED)
- `description`: Transaction description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Studio21UserToken
Manages user authentication tokens:
- `id`: UUID (Primary Key)
- `userId`: Reference to user
- `studio21_token`: Authentication token from Studio 21
- `expiresAt`: Token expiration timestamp
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### User
Represents a user in the system:
- `id`: UUID (Primary Key)
- `username`: Unique username
- `email`: User email
- `password`: Hashed password
- `balance`: User account balance
- `betAllow`: Boolean indicating if betting is allowed
- `status`: User status (1 = active, other = inactive)
- `currencyId`: User's currency identifier
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Security Implementation

### Signature Verification
The system implements RSA-SHA256 signature verification for all POST requests to ensure authenticity and integrity of data.

### Key Management
- Private key (`ec.key`) - Used for signing responses
- Public key (`ec.pub`) - Used for verifying requests

Keys are loaded from the project root directory and are essential for the proper functioning of the API.

## Configuration

The system uses environment variables for configuration:

```
# Database Configuration
DB_TYPE=sqlite
DB_HOST=localhost
DB_PORT=5432
DB_USER=sqlite
DB_PASS=
DB_NAME=studio21.db
DB_SYNCHRONIZE=true
DB_AUTO_LOAD_ENTITIES=true

# Studio 21 API Configuration
STUDIO21_BASE_URL=https://api.studio21.com
STUDIO21_OPERATOR_ID=your_operator_id_here

# Application Configuration
NODE_ENV=development
PORT=3001
```

## Installation and Setup

1. Navigate to the studio21-integration directory:
   ```bash
   cd studio21-integration
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure the RSA keys (`ec.key` and `ec.pub`) are present in the project root directory

4. Configure environment variables in the `.env` file

5. Run the application:
   ```bash
   npm run dev
   ```

## API Usage

### Balance Check
```http
POST /api/studio21-game/balance
Content-Type: application/json
Signature: <base64_encoded_signature>

{
  "operatorId": "your_operator_id",
  "userId": "user123",
  "token": "user_token",
  "gameId": "game123",
  "currency": "USD"
}
```

### Place Bet
```http
POST /api/studio21-game/bet
Content-Type: application/json
Signature: <base64_encoded_signature>

{
  "operatorId": "your_operator_id",
  "userId": "user123",
  "token": "user_token",
  "gameId": "game123",
  "roundId": "round123",
  "transactionId": "txn123",
  "reqId": "req123",
  "debitAmount": "10.00",
  "betType": "spin",
  "currency": "USD"
}
```

### Process Result
```http
POST /api/studio21-game/result
Content-Type: application/json
Signature: <base64_encoded_signature>

{
  "operatorId": "your_operator_id",
  "userId": "user123",
  "token": "user_token",
  "gameId": "game123",
  "roundId": "round123",
  "transactionId": "txn123",
  "reqId": "req123",
  "creditAmount": "15.00",
  "betType": "win",
  "currency": "USD"
}
```

### Rollback Transaction
```http
POST /api/studio21-game/rollback
Content-Type: application/json
Signature: <base64_encoded_signature>

{
  "operatorId": "your_operator_id",
  "userId": "user123",
  "token": "user_token",
  "gameId": "game123",
  "roundId": "round123",
  "transactionId": "txn123",
  "reqId": "req123",
  "rollbackAmount": "10.00",
  "betType": "rollback",
  "currency": "USD"
}
```

## Response Format

All responses follow a consistent format:

```json
{
  "balance": 100.00,
  "status": "OP_SUCCESS"
}
```

Common status codes:
- `OP_SUCCESS` - Operation completed successfully
- `OP_USER_NOT_FOUND` - User not found
- `OP_USER_DISABLED` - User account is disabled
- `OP_TOKEN_NOT_FOUND` - Authentication token not found
- `OP_INVALID_SIGNATURE` - Invalid signature
- `OP_INVALID_PARAMS` - Invalid parameters
- `OP_ERROR_NEGATIVE_DEBIT_AMOUNT` - Negative debit amount
- `OP_TOKEN_EXPIRED` - Token has expired
- `OP_INVALID_GAME` - Invalid game identifier
- `OP_INSUFFICIENT_FUNDS` - Insufficient funds
- `OP_DUPLICATE_TRANSACTION` - Duplicate transaction
- `OP_TRANSACTION_NOT_FOUND` - Transaction not found
- `OP_ERROR_TRANSACTION_INVALID` - Invalid transaction

## Implementation Notes

1. This implementation is completely separate from the existing gapCasino implementation
2. All endpoints follow the Studio 21 Integration API v1.0.8 specifications
3. Database entities are designed to match the requirements in the PDF specification
4. Cryptographic signature verification is implemented for security
5. Proper error handling and status codes are implemented according to the specification
6. The system uses NestJS framework for modularity and maintainability
7. TypeORM is used for database operations with proper entity relationships