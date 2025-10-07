# Database Scripts

This directory contains scripts for managing the database.

## Available Scripts

### Insert Games
Inserts games from the `mutatedData.gapcasinoschemas.json` file into the database:

```bash
npm run insert-games
```

This script will:
- Connect to the PostgreSQL database using the configuration in `.env`
- Read all games from the JSON file
- Insert new games or update existing ones based on gameId
- Process games in batches to avoid memory issues

### Verify Games
Verifies that games have been correctly inserted into the database:

```bash
npm run verify-games
```

This script will:
- Show the total number of games in the database
- Display a sample of the most recent games
- Show the top 10 providers by game count

### Test Optimized Endpoints
Tests the optimized games endpoints with filtering capabilities:

```bash
npm run get-all-games
```

This script will:
- Test the provider names endpoint
- Test the games endpoint with various filters
- Display results for verification

## How It Works

1. The insert script reads the `mutatedData.gapcasinoschemas.json` file
2. For each game, it checks if a game with the same `gameId` already exists
3. If it exists, it updates the game information
4. If it doesn't exist, it creates a new game entry
5. All games are inserted into the `gap_casinos` table

## Troubleshooting

If you encounter any issues:

1. Make sure the PostgreSQL database is running
2. Verify the database credentials in the `.env` file
3. Ensure the `mutatedData.gapcasinoschemas.json` file is in the root directory
4. Check that all required npm packages are installed (`npm install`)