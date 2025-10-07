# Continuous Batched Games Endpoint

This document describes the endpoint for retrieving casino games in continuous batches grouped by provider.

## Endpoint

```
GET /gap-casino-game/providers/continuous-batch
```

## Description

This endpoint returns games grouped by providerName in continuous batches. Each batch contains up to the specified number of games (default 200), with providers combined as needed to fill the batch size. If a provider has fewer games than the batch size, the next provider's games will be included in the same batch.

## Query Parameters

- `batchNumber` (optional, default: 0) - The batch number to retrieve (0 for first batch, 1 for second, etc.)
- `batchSize` (optional, default: 200) - Number of games per batch

## Response Format

```json
{
  "data": [
    {
      "providerName": "SUNO",
      "games": [
        {
          "id": "1",
          "gameId": "game_001",
          "name": "Game 1",
          "gameCode": "G001",
          "category": "slots",
          "providerName": "SUNO",
          "subProviderName": "SUNO_SUB",
          "urlThumb": "https://example.com/thumb1.jpg",
          "status": true,
          "token": "token_1",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
        // ... more games from SUNO
      ]
    },
    {
      "providerName": "DC",
      "games": [
        {
          "id": "101",
          "gameId": "game_101",
          "name": "Game 101",
          "gameCode": "G101",
          "category": "slots",
          "providerName": "DC",
          "subProviderName": "DC_SUB",
          "urlThumb": "https://example.com/thumb101.jpg",
          "status": true,
          "token": "token_101",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
        // ... more games from DC to fill the batch
      ]
    }
    // ... more providers as needed to fill the batch
  ],
  "pagination": {
    "batchNumber": 0,
    "batchSize": 200,
    "totalGames": 1500,
    "hasMore": true
  },
  "status": "success",
  "message": "Games continuous batch retrieved successfully"
}
```

## Example Scenario

If provider SUNO has only 20 games and you request a batch of 200 games:
- The response will include all 20 SUNO games
- It will also include games from the next provider (e.g., DC) to fill up to 200 games
- This continues until the batch is filled or all games are included

## Usage Examples

### Get First Batch (200 games)
```
GET /gap-casino-game/providers/continuous-batch
```

### Get Second Batch (200 games)
```
GET /gap-casino-game/providers/continuous-batch?batchNumber=1
```

### Get First Batch with 100 games
```
GET /gap-casino-game/providers/continuous-batch?batchSize=100
```

### Get Third Batch with 300 games
```
GET /gap-casino-game/providers/continuous-batch?batchNumber=2&batchSize=300
```

## Frontend Implementation

```javascript
async function loadAllGamesInContinuousBatches() {
  let batchNumber = 0;
  let hasMore = true;
  const allProviders = [];
  
  while (hasMore) {
    try {
      const response = await fetch(`/gap-casino-game/providers/continuous-batch?batchNumber=${batchNumber}&batchSize=200`);
      const result = await response.json();
      
      // Add providers from this batch to our collection
      allProviders.push(...result.data);
      
      // Check if there are more batches
      hasMore = result.pagination.hasMore;
      batchNumber++;
      
      // Process the games for display
      displayGames(result.data);
      
      // Optional: Add delay to avoid overwhelming the server
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Failed to load batch ${batchNumber}:`, error);
      break;
    }
  }
  
  console.log(`Loaded ${allProviders.length} providers with all their games`);
}

function displayGames(providers) {
  // Process and display the games from the current batch
  providers.forEach(provider => {
    console.log(`Provider: ${provider.providerName} (${provider.games.length} games)`);
    // Add to UI
  });
}
```

## Benefits of This Approach

1. **Efficient Batching**: Each batch is filled to the specified size
2. **Provider Combination**: Small providers are combined with others to optimize batch size
3. **Sequential Order**: Games are always ordered by providerName and name
4. **Progressive Loading**: Frontend can load and display games as batches arrive
5. **Memory Efficiency**: Controlled payload sizes reduce memory usage
6. **Better User Experience**: Users see more games per request

## Response Structure

The response follows the standard format:
- `data`: Array of provider objects for the current batch
- Each provider object contains:
  - `providerName`: Name of the provider
  - `games`: Array of games for this provider in the current batch
- `pagination`: Information about the current batch and whether more exist
- `status`: Success status
- `message`: Descriptive message

## Testing

You can test this endpoint using:
1. The provided test script: `npm run get-all-games`
2. Direct API calls with tools like curl or Postman
3. Browser fetch requests

This approach ensures that each batch is efficiently filled with games from one or more providers, optimizing the data transfer while maintaining the logical grouping by provider.