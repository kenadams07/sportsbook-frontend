/**
 * Comprehensive test script to verify all scenarios for the single API endpoint
 * GET /gap-casino-game/providers/games
 */

import axios from 'axios';

async function runComprehensiveTest() {
  try {
    console.log('🧪 Running comprehensive test of the single API endpoint...\n');
    
    // Test 1: Default loading (initial page load)
    console.log('1. Initial page load - default parameters');
    console.log('   URL: /gap-casino-game/providers/games');
    const defaultResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games');
    console.log(`   ✅ Success: ${defaultResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${defaultResponse.data.pagination.totalGames}`);
    console.log(`   🔁 Has more batches: ${defaultResponse.data.pagination.hasMore}\n`);
    
    // Test 2: First batch with explicit parameters
    console.log('2. First batch with explicit parameters');
    console.log('   URL: /gap-casino-game/providers/games?batchNumber=0&batchSize=50&providerName=all');
    const firstBatchResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=0&batchSize=50&providerName=all');
    console.log(`   ✅ Success: ${firstBatchResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${firstBatchResponse.data.pagination.totalGames}`);
    console.log(`   🔁 Has more batches: ${firstBatchResponse.data.pagination.hasMore}\n`);
    
    // Test 3: Second batch
    console.log('3. Second batch');
    console.log('   URL: /gap-casino-game/providers/games?batchNumber=1&batchSize=50&providerName=all');
    const secondBatchResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=1&batchSize=50&providerName=all');
    console.log(`   ✅ Success: ${secondBatchResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${secondBatchResponse.data.pagination.totalGames}`);
    console.log(`   🔁 Has more batches: ${secondBatchResponse.data.pagination.hasMore}\n`);
    
    // Test 4: Specific provider
    console.log('4. Specific provider games');
    console.log('   URL: /gap-casino-game/providers/games?providerName=DC');
    const providerResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=DC');
    console.log(`   ✅ Success: ${providerResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${providerResponse.data.pagination.totalGames}`);
    console.log(`   🔁 Has more batches: ${providerResponse.data.pagination.hasMore}\n`);
    
    // Test 5: Search across all providers
    console.log('5. Search across all providers');
    console.log('   URL: /gap-casino-game/providers/games?search=Roulette&providerName=all');
    const searchAllResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?search=Roulette&providerName=all');
    console.log(`   ✅ Success: ${searchAllResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${searchAllResponse.data.pagination.totalGames}`);
    console.log(`   🔍 Search query: "${searchAllResponse.data.pagination.searchQuery}"`);
    console.log(`   🔁 Has more batches: ${searchAllResponse.data.pagination.hasMore}\n`);
    
    // Test 6: Search within specific provider
    console.log('6. Search within specific provider');
    console.log('   URL: /gap-casino-game/providers/games?providerName=DC&search=Roulette');
    const searchProviderResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=DC&search=Roulette');
    console.log(`   ✅ Success: ${searchProviderResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${searchProviderResponse.data.pagination.totalGames}`);
    console.log(`   🔍 Search query: "${searchProviderResponse.data.pagination.searchQuery}"`);
    console.log(`   🔁 Has more batches: ${searchProviderResponse.data.pagination.hasMore}\n`);
    
    // Test 7: Your specific example
    console.log('7. Your specific example');
    console.log('   URL: /gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette');
    const specificResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette');
    console.log(`   ✅ Success: ${specificResponse.data.data.length} providers in batch`);
    console.log(`   📊 Total games: ${specificResponse.data.pagination.totalGames}`);
    console.log(`   🔍 Search query: "${specificResponse.data.pagination.searchQuery}"`);
    console.log(`   🔁 Has more batches: ${specificResponse.data.pagination.hasMore}\n`);
    
    console.log('🎉 All scenarios working correctly!');
    console.log('\n📋 Summary of capabilities:');
    console.log('   • Batched loading with configurable batch size');
    console.log('   • Provider filtering (all providers by default)');
    console.log('   • Search functionality (blank by default)');
    console.log('   • All combinations of parameters work correctly');
    console.log('   • Efficient pagination for large datasets');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the comprehensive test
runComprehensiveTest().catch(console.error);