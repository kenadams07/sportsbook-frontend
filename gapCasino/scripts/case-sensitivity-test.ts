/**
 * Test script to verify case-insensitive providerName handling
 */

import axios from 'axios';

async function testCaseSensitivity() {
  try {
    console.log('Testing case-insensitive providerName handling...\n');
    
    // Test lowercase "all"
    console.log('1. Testing providerName=all (lowercase)');
    const lowercaseResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=all');
    console.log(`   ✅ Success: ${lowercaseResponse.data.data.length} providers`);
    console.log(`   📊 Total games: ${lowercaseResponse.data.pagination.totalGames}\n`);
    
    // Test uppercase "ALL"
    console.log('2. Testing providerName=ALL (uppercase)');
    const uppercaseResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=ALL');
    console.log(`   ✅ Success: ${uppercaseResponse.data.data.length} providers`);
    console.log(`   📊 Total games: ${uppercaseResponse.data.pagination.totalGames}\n`);
    
    // Test mixed case "All"
    console.log('3. Testing providerName=All (mixed case)');
    const mixedResponse = await axios.get('http://localhost:3005/api/gap-casino-game/providers/games?providerName=All');
    console.log(`   ✅ Success: ${mixedResponse.data.data.length} providers`);
    console.log(`   📊 Total games: ${mixedResponse.data.pagination.totalGames}\n`);
    
    // Verify they all return the same number of games
    if (lowercaseResponse.data.pagination.totalGames === uppercaseResponse.data.pagination.totalGames && 
        uppercaseResponse.data.pagination.totalGames === mixedResponse.data.pagination.totalGames) {
      console.log('🎉 All cases return the same result - case-insensitive handling works perfectly!');
    } else {
      console.log('❌ Inconsistent results found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCaseSensitivity().catch(console.error);