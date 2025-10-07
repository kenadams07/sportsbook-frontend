# Optimized Games Endpoints

This document describes the optimized endpoints for retrieving casino game data with filtering capabilities.

## Provider Names Endpoint

```
GET /gap-casino-game/providers/names
```

### Description

Returns a list of all provider names sorted by priority for use in the sidebar.

### Response Format

```json
{
  "data": [
    "SUNO",
    "DC",
    "EZUGI",
    "RG",
    "Unknown",
    // ... other providers sorted by priority
  ],
  "status": "success",
  "message": "Provider names retrieved successfully"
}
```

### Usage Example

```javascript
// Get all provider names for sidebar
const response = await fetch('/gap-casino-game/providers/names');
const providers = response.data; // Array of provider names
```

## Optimized Games Endpoint (Single Endpoint for All Cases)

```
GET /gap-casino-game/providers/games
```

### Description

**Single optimized endpoint that handles ALL game loading scenarios:**
- Initial page load with default parameters
- Batched loading with configurable batch size
- Provider filtering (all providers by default)
- Search functionality (blank by default)
- All combinations of the above parameters

This endpoint was specifically designed to handle your exact requirements:
- `batchNumber` and `batchSize` can be passed from frontend according to need
- `providerName` defaults to "all" when games initially load
- `search` query is initially blank but can filter games by name

### Query Parameters

- `batchNumber` (optional, default: 0) - The batch number to retrieve (0 for first batch, 1 for second, etc.)
- `batchSize` (optional, default: 200) - Number of games per batch (frontend can control this)
- `providerName` (optional, default: "all") - Filter games by specific provider name:
  - "all" or omit parameter: Shows games from ALL providers (initial page load)
  - Specific provider name (e.g., "DC"): Shows games only from that provider
- `search` (optional, default: "") - Search games by name (case-insensitive partial match):
  - Blank/omit: No search filtering (initial page load)
  - Text value: Filters games by name across selected providers

### Response Format

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
        // ... more games
      ]
    }
    // ... more providers in this batch
  ],
  "pagination": {
    "batchNumber": 0,
    "batchSize": 200,
    "totalGames": 1500,
    "hasMore": true,
    "providerName": "all",
    "searchQuery": ""
  },
  "status": "success",
  "message": "Games retrieved successfully"
}
```

### Usage Examples for Your Exact Requirements

#### Initial Page Load (Default Behavior)
```
GET /gap-casino-game/providers/games
```
- Uses default batchNumber=0, batchSize=200
- providerName defaults to "all" (shows games from all providers)
- search query is blank by default
- Perfect for initial page load

#### Load Next Batch (Progressive Loading)
```
GET /gap-casino-game/providers/games?batchNumber=1&batchSize=100
```
- Frontend controls batchNumber and batchSize according to need
- Still shows games from all providers (providerName defaults to "all")
- Search query remains blank

#### Your Specific Example (Working Now!)
```
GET /gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette
```
- batchNumber=1: Second batch
- batchSize=100: 100 games per batch
- providerName=all: Shows games from ALL providers
- search=Roulette: Filters games by "Roulette" across all providers

### All Possible Combinations

#### Default Initial Load
```
GET /gap-casino-game/providers/games
```

#### Specific Batch Size
```
GET /gap-casino-game/providers/games?batchSize=50
```

#### Specific Batch Number
```
GET /gap-casino-game/providers/games?batchNumber=2
```

#### Next Batch with Custom Size
```
GET /gap-casino-game/providers/games?batchNumber=1&batchSize=100
```

#### All Providers with Search
```
GET /gap-casino-game/providers/games?search=Blackjack
```

#### Specific Provider Only
```
GET /gap-casino-game/providers/games?providerName=SUNO
```

#### Specific Provider with Search
```
GET /gap-casino-game/providers/games?providerName=DC&search=Roulette
```

#### Custom Batch of Specific Provider with Search
```
GET /gap-casino-game/providers/games?batchNumber=1&batchSize=50&providerName=DC&search=Card
```

## Frontend Implementation

### Loading Provider Names for Sidebar
```javascript
async function loadProviderNames() {
  try {
    const response = await fetch('/gap-casino-game/providers/names');
    const result = await response.json();
    return result.data; // Array of provider names
  } catch (error) {
    console.error('Failed to load provider names:', error);
    return [];
  }
}

// Usage
const providers = await loadProviderNames();
// Render sidebar with providers and "ALL" option
```

### Loading Games with Progressive Batching
```javascript
class GameLoader {
  constructor() {
    this.currentBatch = 0;
    this.batchSize = 200;
    this.currentProvider = 'all'; // Default to all providers
    this.currentSearch = '';
    this.hasMore = true;
    this.allLoadedProviders = [];
  }

  async loadNextBatch() {
    if (!this.hasMore) return null;

    try {
      const params = new URLSearchParams({
        batchNumber: this.currentBatch.toString(),
        batchSize: this.batchSize.toString(),
        providerName: this.currentProvider,
        search: this.currentSearch
      });

      const response = await fetch(`/gap-casino-game/providers/games?${params}`);
      const result = await response.json();
      
      // Update pagination info
      this.hasMore = result.pagination.hasMore;
      this.currentBatch++;
      
      // Merge providers with existing ones to maintain continuity
      this.mergeProviders(result.data);
      
      return this.allLoadedProviders;
    } catch (error) {
      console.error('Failed to load games:', error);
      return null;
    }
  }

  mergeProviders(newProviders) {
    newProviders.forEach(newProvider => {
      const existingProvider = this.allLoadedProviders.find(p => p.providerName === newProvider.providerName);
      if (existingProvider) {
        // Append games to existing provider
        existingProvider.games = [...existingProvider.games, ...newProvider.games];
      } else {
        // Add new provider
        this.allLoadedProviders.push(newProvider);
      }
    });
  }

  // Change provider filter
  setProvider(providerName) {
    this.currentProvider = providerName;
    this.currentBatch = 0;
    this.hasMore = true;
    this.allLoadedProviders = []; // Reset loaded providers
  }

  // Change search filter
  setSearch(searchQuery) {
    this.currentSearch = searchQuery;
    this.currentBatch = 0;
    this.hasMore = true;
    this.allLoadedProviders = []; // Reset loaded providers
  }

  // Reset filters to default (all providers)
  resetFilters() {
    this.currentProvider = 'all';
    this.currentSearch = '';
    this.currentBatch = 0;
    this.hasMore = true;
    this.allLoadedProviders = []; // Reset loaded providers
  }
}

// Usage
const gameLoader = new GameLoader();

// Initial page load - shows ALL games from ALL providers
let providers = await gameLoader.loadNextBatch();

// When user selects a specific provider
gameLoader.setProvider('SUNO');
providers = await gameLoader.loadNextBatch();

// When user searches across ALL providers
gameLoader.setSearch('Blackjack');
providers = await gameLoader.loadNextBatch();

// When user selects a provider AND searches
gameLoader.setProvider('DC');
gameLoader.setSearch('Roulette');
providers = await gameLoader.loadNextBatch();

// When user resets to view ALL providers again
gameLoader.resetFilters();
providers = await gameLoader.loadNextBatch();

// When user scrolls to load more batches
if (gameLoader.hasMore) {
  const moreProviders = await gameLoader.loadNextBatch();
  // Update UI with merged providers
}
```

## Benefits of This Approach

1. **Single Optimized Endpoint**: One endpoint handles ALL game loading scenarios
2. **Efficient Batching**: Games are loaded in optimal batches
3. **Flexible Filtering**: Supports provider and search filtering
4. **Memory Efficient**: Database queries are optimized with proper pagination
5. **Fast Sidebar Loading**: Separate endpoint for quick provider name loading
6. **Progressive Enhancement**: Users can start interacting before all data loads
7. **Scalable**: Works efficiently regardless of dataset size
8. **Intuitive Defaults**: "all" providers is the default behavior

## Performance Considerations

1. **Database Indexes**: Ensure indexes exist on `providerName` and `name` fields
2. **Query Optimization**: Database queries use proper LIMIT/OFFSET pagination
3. **Batch Sizing**: Configurable batch sizes allow tuning for different network conditions
4. **Provider Priority**: Providers are sorted by business priority

## Testing

You can test these endpoints using:
1. Direct API calls with tools like curl or Postman
2. Browser fetch requests
3. Integration with frontend components

This optimized approach provides a single endpoint that efficiently handles all game loading scenarios while maintaining a separate fast endpoint for provider names.