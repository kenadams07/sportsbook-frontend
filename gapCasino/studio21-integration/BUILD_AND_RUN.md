# Building and Running the Studio 21 Integration

## Prerequisites

1. Node.js (version 14 or higher)
2. npm (comes with Node.js)
3. SQLite (for development) or PostgreSQL (for production)
4. RSA key pair (ec.key and ec.pub files)

## Setup Instructions

### 1. Install Dependencies

Navigate to the studio21-integration directory and install the required packages:

```bash
cd studio21-integration
npm install
```

### 2. RSA Key Setup

The Studio 21 API requires RSA key pairs for signature verification:
- `ec.key` - Private key (for signing responses)
- `ec.pub` - Public key (for verifying requests)

Place these files in the project root directory. If you don't have these keys, you can generate them using OpenSSL:

```bash
# Generate private key
openssl genrsa -out ec.key 2048

# Generate public key from private key
openssl rsa -in ec.key -pubout -out ec.pub
```

### 3. Environment Configuration

Update the `.env` file with your specific configuration:

```env
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
STUDIO21_OPERATOR_ID=your_actual_operator_id_here

# Application Configuration
NODE_ENV=development
PORT=3001
```

### 4. Build the Application

Compile the TypeScript code to JavaScript:

```bash
npm run build
```

### 5. Run the Application

Start the application in production mode:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## API Endpoints

Once the application is running, the following endpoints will be available:

- Balance Check: `POST http://localhost:3001/api/studio21-game/balance`
- Place Bet: `POST http://localhost:3001/api/studio21-game/bet`
- Process Result: `POST http://localhost:3001/api/studio21-game/result`
- Rollback Transaction: `POST http://localhost:3001/api/studio21-game/rollback`
- Game Launch: `GET http://localhost:3001/api/studio21-game/game-url`

## Testing

You can test the signature service with the provided test script:

```bash
npx ts-node test-studio21.ts
```

## Database

The application uses SQLite by default for development. The database file will be created automatically as `studio21.db` in the project root.

For production, you can configure PostgreSQL by updating the environment variables:

```env
DB_TYPE=postgres
DB_HOST=your_postgres_host
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASS=your_postgres_password
DB_NAME=your_database_name
```

## Troubleshooting

### Common Issues

1. **Missing RSA Keys**: If you see signature-related errors, ensure the `ec.key` and `ec.pub` files are in the project root.

2. **Database Connection Errors**: Verify your database configuration in the `.env` file.

3. **Port Conflicts**: If port 3001 is in use, change the PORT variable in the `.env` file.

4. **Module Not Found Errors**: Run `npm install` to ensure all dependencies are installed.

### Logs

Check the console output for any error messages. The application will log startup information and any errors that occur during runtime.

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in the `.env` file
2. Configure your production database settings
3. Build the application with `npm run build`
4. Run with `npm start`
5. Consider using a process manager like PM2 for production deployments

## API Documentation

For detailed API documentation, refer to the `STUDIO21_API_DOCUMENTATION.md` file in this directory.