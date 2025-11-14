import axios from 'axios';

async function testFrontendSimulation() {
  console.log('Testing Frontend Simulation...');
  
  try {
    // Simulate how the frontend might be calling the API
    const gameId = 820;
    const gameCode = 's21.lucky.7.rng.1';
    
    // Test 1: Direct call with query parameters (like the frontend would do)
   
    const url1 = `http://localhost:3005/api/studio21-game/game-url?gameId=${gameId}&gameCode=${gameCode}`;

    
    const response1 = await axios.get(url1);

    const gameId2 = 804;
    const gameCode2 = 's21.crash.soccer';
    
    const url2 = `http://localhost:3005/api/studio21-game/game-url?gameId=${gameId2}&gameCode=${gameCode2}`;
  
    
    const response2 = await axios.get(url2);

    
    // Compare session IDs to ensure they're different
    const sessionId1 = response1.data.data.url.split('session-id=')[1];
    const sessionId2 = response2.data.data.url.split('session-id=')[1];
    
 
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testFrontendSimulation();