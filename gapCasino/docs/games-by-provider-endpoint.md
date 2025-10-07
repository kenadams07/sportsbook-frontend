# Games by Provider Endpoint

## Overview
This endpoint returns all casino games grouped by their provider names. The data is organized to make it easy for the frontend to display games under their respective provider headings.

## Endpoint
```
GET /api/gap-casino-game/games-by-provider
```

## Response Format
```json
{
  "data": [
    {
      "providerName": "SUNO",
      "games": [
        {
          "id": "uuid",
          "gameId": "string",
          "name": "string",
          "gameCode": "string",
          "category": "string",
          "providerName": "string",
          "subProviderName": "string",
          "urlThumb": "string",
          "status": true,
          "token": "string",
          "createdAt": "date",
          "updatedAt": "date"
        }
        // ... more games
      ]
    }
    // ... more providers
  ],
  "status": "success",
  "message": "Games grouped by provider retrieved successfully"
}
```

## Provider Priority
Providers are sorted with the following priority:
1. SUNO
2. DC
3. EZUGI
4. RG
5. Other providers (sorted alphabetically)

## Progressive Loading Endpoint

For better performance with large datasets, there's also a progressive loading endpoint:

```
GET /api/gap-casino-game/providers/progressive
```

### Query Parameters:
- `providerOffset` (number): Index of the provider to start from (default: 0)
- `gameOffset` (number): Number of games to skip within the current provider (default: 0)
- `limit` (number): Number of games to return per request (default: 15)

### Progressive Loading Response Format:
```json
{
  "data": [
    {
      "providerName": "SUNO",
      "subProviderName": "SuperNowa",
      "games": [...],
      "totalGames": 15
    }
  ],
  "pagination": {
    "providerOffset": 0,
    "gameOffset": 15,
    "limit": 15,
    "hasMore": true,
    "currentProvider": "SUNO",
    "hasMoreGamesInCurrentProvider": false,
    "hasMoreProviders": true
  },
  "status": "success",
  "message": "Games retrieved successfully"
}
```

## Usage Example
```javascript
// Fetch games grouped by provider
fetch('/api/gap-casino-game/games-by-provider')
  .then(response => response.json())
  .then(data => {
    // data.data is an array of providers with their games
    data.data.forEach(provider => {
      console.log(`Provider: ${provider.providerName}`);
      console.log(`Games: ${provider.games.length}`);
      
      // Display provider heading
      displayProviderHeading(provider.providerName);
      
      // Display games for this provider
      provider.games.forEach(game => {
        displayGame(game);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching games:', error);
  });
```

## Frontend Progressive Loading Implementation

For infinite scroll implementation:

1. **Initial Request**: 
   - `providerOffset=0`, `gameOffset=0`
   - Returns first `limit` games from the first provider (SUNO)

2. **Continue with Same Provider**:
   - If the current provider has more games, increment `gameOffset` by `limit`
   - Returns next `limit` games from the same provider

3. **Move to Next Provider**:
   - When all games from current provider are loaded, the backend returns:
     - `providerOffset` incremented by 1
     - `gameOffset` reset to 0
   - Next request uses these values to load games from the next provider

4. **End of Data**:
   - When all providers and games are loaded, `hasMore` will be `false`

## Sample Response Structure
```json
{
  "data": [
    {
      "providerName": "SUNO",
      "games": [
        {
          "id": "415db5dc-a45c-466b-9fd7-4007d15a5941",
          "gameId": "500001",
          "name": "Teen Patti",
          "gameCode": "TP",
          "category": "LIVE",
          "providerName": "SUNO",
          "subProviderName": "SuperNowa",
          "urlThumb": "https://cdn-b2b.betxasia.co/metawalletlandingpage/supernowa/Artboard+1+copy+9.png",
          "status": true,
          "token": "b4620466-1d14-45b4-8840-7ff1720a1cb9684d72900d6d761f4dd9b35c",
          "createdAt": "2025-07-23T13:15:05.860Z",
          "updatedAt": "2025-07-23T13:15:05.860Z"
        }
        // ... more SUNO games
      ]
    },
    {
      "providerName": "DC",
      "games": [
        // ... DC games
      ]
    }
    // ... other providers
  ],
  "status": "success",
  "message": "Games grouped by provider retrieved successfully"
}
```