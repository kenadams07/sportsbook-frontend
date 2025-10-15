import { config } from 'dotenv';
import { join } from 'path';
import axios from 'axios';
import { SignatureService } from '../src/common/utils/studio21/signature-studio21.service';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function testStudio21GameUrl() {
  console.log('Testing Studio 21 Game URL API...');
  
  try {
    const signatureService = new SignatureService();
    
    // Test with different games
    const testGames = [
      { gameId: 804, gameCode: 's21.crash.soccer' },
      { gameId: 820, gameCode: 's21.lucky.7.rng.1' },
      { gameId: 805, gameCode: 's21.crash.cricket' }
    ];
    
    for (const game of testGames) {
      console.log(`\nTesting game: ${game.gameCode} (ID: ${game.gameId})`);
      
      const requestData = {
        partner_id: process.env.STUDIO21_PARTNER_ID,
        user: 'testuser',
        token: `test-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        platform: 'GPL_DESKTOP',
        currency: 'USD',
        country: 'US',
        lang: 'en',
        ip: '1.1.1.1',
        game_id: game.gameId,
        game_code: game.gameCode,
        lobby_url: 'https://yourdomain.com/lobby',
        deposit_url: 'https://yourdomain.com/deposit'
      };
      
      console.log('Request data:', requestData);
      
      const dataStringify = JSON.stringify(requestData);
      const encodedSignature = await signatureService.createSignature(dataStringify);
      
      const headers = {
        'Casino-Signature': encodedSignature,
        'Content-Type': 'application/json',
      };
      
      console.log('Headers:', headers);
      
      const apiUrl = `${process.env.STUDIO21_BASE_URL}/games/url`;
      console.log('API URL:', apiUrl);
      
      try {
        const response = await axios.post(apiUrl, requestData, { headers });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      }
    }
  } catch (error) {
    console.error('Error testing Studio 21 Game URL:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testStudio21GameUrl();