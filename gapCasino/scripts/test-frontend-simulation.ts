import axios from 'axios';

async function testFrontendSimulation() {
  console.log('Testing Frontend Simulation...');
  
  try {
    // Simulate how the frontend might be calling the API
    const gameId = 820;
    const gameCode = 's21.lucky.7.rng.1';
    
    // Test 1: Direct call with query parameters (like the frontend would do)
    console.log('\n--- Test 1: Direct call with query parameters ---');
    const url1 = `http://localhost:3005/api/studio21-game/game-url?gameId=${gameId}&gameCode=${gameCode}`;
    console.log('Calling URL:', url1);
    
    const response1 = await axios.get(url1);
    console.log('Response:', response1.data);
    
    // Test 2: Call with different game to ensure we get different URLs
    console.log('\n--- Test 2: Different game ---');
    const gameId2 = 804;
    const gameCode2 = 's21.crash.soccer';
    
    const url2 = `http://localhost:3005/api/studio21-game/game-url?gameId=${gameId2}&gameCode=${gameCode2}`;
    console.log('Calling URL:', url2);
    
    const response2 = await axios.get(url2);
    console.log('Response:', response2.data);
    
    // Compare session IDs to ensure they're different
    const sessionId1 = response1.data.data.url.split('session-id=')[1];
    const sessionId2 = response2.data.data.url.split('session-id=')[1];
    
    console.log('\n--- Comparison ---');
    console.log('Session ID 1:', sessionId1);
    console.log('Session ID 2:', sessionId2);
    console.log('Are they different?', sessionId1 !== sessionId2);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testFrontendSimulation();