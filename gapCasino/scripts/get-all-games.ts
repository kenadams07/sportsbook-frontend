/**
 * Simple script to test the optimized games endpoints
 * This script demonstrates the new provider names and optimized games endpoint
 */

import axios from 'axios';

async function testOptimizedEndpoints() {
  try {
    console.log('Testing optimized games endpoints...\n');
    
    // Test 1: Get provider names
    console.log('1. Testing provider names endpoint...');
    const providerNamesResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/names');
    console.log(`✅ Provider names retrieved successfully`);
    console.log(`   Total providers: ${providerNamesResponse.data.data.length}`);
    console.log(`   First 5 providers: ${providerNamesResponse.data.data.slice(0, 5).join(', ')}\n`);
    
    // Test 2: Get first batch of all games (using "all")
    console.log('2. Testing optimized games endpoint with providerName=all...');
    const allGamesResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchSize=50&providerName=all');
    console.log(`✅ All games batch retrieved successfully`);
    console.log(`   Providers in batch: ${allGamesResponse.data.data.length}`);
    console.log(`   Total games available: ${allGamesResponse.data.pagination.totalGames}`);
    console.log(`   Has more batches: ${allGamesResponse.data.pagination.hasMore}\n`);
    
    // Test 3: Get first batch of all games (default - no provider specified)
    console.log('3. Testing optimized games endpoint with default behavior (all providers)...');
    const defaultAllGamesResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchSize=50');
    console.log(`✅ All games batch retrieved successfully`);
    console.log(`   Providers in batch: ${defaultAllGamesResponse.data.data.length}`);
    console.log(`   Total games available: ${defaultAllGamesResponse.data.pagination.totalGames}`);
    console.log(`   Has more batches: ${defaultAllGamesResponse.data.pagination.hasMore}\n`);
    
    // Test 4: Get games for a specific provider
    if (providerNamesResponse.data.data.length > 0) {
      const firstProvider = providerNamesResponse.data.data[0];
      console.log(`4. Testing optimized games endpoint for provider: ${firstProvider}...`);
      const providerGamesResponse = await axios.get(`http://localhost:3005/api/gap-casino-game/providers/games?providerName=${firstProvider}&batchSize=50`);
      console.log(`✅ Provider games batch retrieved successfully`);
      console.log(`   Providers in batch: ${providerGamesResponse.data.data.length}`);
      console.log(`   Total games available: ${providerGamesResponse.data.pagination.totalGames}`);
      console.log(`   Has more batches: ${providerGamesResponse.data.pagination.hasMore}\n`);
    }
    
    // Test 5: Search for games across all providers
    console.log('5. Testing optimized games endpoint with search across all providers...');
    const searchResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?search=card&batchSize=50&providerName=all');
    console.log(`✅ Search results batch retrieved successfully`);
    console.log(`   Providers in batch: ${searchResponse.data.data.length}`);
    console.log(`   Total games available: ${searchResponse.data.pagination.totalGames}`);
    console.log(`   Has more batches: ${searchResponse.data.pagination.hasMore}\n`);
    
    console.log('🎉 All endpoint tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to test endpoints:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
testOptimizedEndpoints().catch(console.error);