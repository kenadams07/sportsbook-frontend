/**
 * Simple script to test the specific endpoint that's failing
 * Testing: http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette
 */

import axios from 'axios';

async function testSpecificEndpoint() {
  try {
    console.log('Testing specific endpoint...\n');
    
    // Test the exact URL that's failing
    console.log('Testing: http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette');
    const response = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=1&batchSize=100&providerName=all&search=Roulette');
    console.log(`✅ Response received successfully`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data keys: ${Object.keys(response.data)}`);
    console.log(`   Providers in batch: ${response.data.data?.length || 0}`);
    console.log(`   Pagination: ${JSON.stringify(response.data.pagination, null, 2)}`);
    
    // Test with providerName=all explicitly
    console.log('\nTesting with providerName=all explicitly...');
    const responseAll = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=all');
    console.log(`✅ Response received successfully`);
    console.log(`   Providers in batch: ${responseAll.data.data?.length || 0}`);
    console.log(`   Pagination: ${JSON.stringify(responseAll.data.pagination, null, 2)}`);
    
    // Test without providerName (should default to all)
    console.log('\nTesting without providerName (should default to all)...');
    const responseDefault = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games');
    console.log(`✅ Response received successfully`);
    console.log(`   Providers in batch: ${responseDefault.data.data?.length || 0}`);
    console.log(`   Pagination: ${JSON.stringify(responseDefault.data.pagination, null, 2)}`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to test endpoint:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the script
testSpecificEndpoint().catch(console.error);