// Simple test script to verify the games API integration
const testGamesApi = async () => {
  try {
    console.log('Testing games API with SPRIBE provider...');
    
    // Using the same endpoint as in the Games component
    const response = await fetch('http://localhost:3005/api/gap-casino-game/providers/games?batchNumber=0&batchSize=5&providerName=SPRIBE&search=');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if the response has the expected structure
    if (data.status === 'success') {
      console.log('✅ API call successful');
      
      // Check if we have games data
      if (Array.isArray(data.data)) {
        console.log(`✅ Received ${data.data.length} provider entries`);
        
        // Check if we have games in the first provider
        if (data.data.length > 0 && Array.isArray(data.data[0].games)) {
          console.log(`✅ First provider has ${data.data[0].games.length} games`);
          console.log('Sample game:', data.data[0].games[0]);
        }
      }
      
      return data;
    } else {
      console.error('❌ API returned an error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error testing games API:', error.message);
    return null;
  }
};

// Run the test if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testGamesApi();
}

module.exports = { testGamesApi };