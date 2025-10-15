import axios from 'axios';

async function testGameUrlEndpoint() {
  console.log('Testing Studio 21 Game URL Endpoint...');
  
  try {
    // Test with a specific game
    const gameId = 820;
    const gameCode = 's21.lucky.7.rng.1';
    
    const url = `http://localhost:3005/api/studio21-game/game-url?gameId=${gameId}&gameCode=${gameCode}`;
    console.log('Calling URL:', url);
    
    const response = await axios.get(url);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testGameUrlEndpoint();