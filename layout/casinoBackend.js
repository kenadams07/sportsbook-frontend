import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Sample casino providers
const providers = [
  { providerName: 'NetEnt' },
  { providerName: 'Microgaming' },
  { providerName: 'Playtech' },
  { providerName: 'Evolution' },
  { providerName: 'Pragmatic Play' },
  { providerName: 'Quickspin' },
  { providerName: 'Yggdrasil' },
  { providerName: 'Red Tiger' },
  { providerName: 'Aristocrat' },
  { providerName: 'IGT' },
  { providerName: 'Big Time Gaming' },
  { providerName: 'Nolimit City' },
  { providerName: 'Push Gaming' },
  { providerName: 'Relax Gaming' },
  { providerName: 'Thunderkick' }
];

// Sample games data
const generateGames = (providerName, count) => {
  return Array.from({ length: count }, (_, index) => ({
    gameId: `${providerName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    name: `${providerName} Game ${index + 1}`,
    imageUrl: `https://placehold.co/300x200?text=${providerName}+Game+${index + 1}`,
    providerName: providerName,
    category: index % 3 === 0 ? 'Slots' : index % 3 === 1 ? 'Table Games' : 'Live Casino',
    RTP: 94.0 + (Math.random() * 6)
  }));
};

// Progressive loading endpoint for casino games
app.get('/api/gap-casino-game/providers/progressive', (req, res) => {
  const { providerOffset = 0, gameOffset = 0, limit = 15 } = req.query;
  
  console.log(`Progressive loading request - providerOffset: ${providerOffset}, gameOffset: ${gameOffset}, limit: ${limit}`);
  
  // Simulate network delay
  setTimeout(() => {
    try {
      // Convert query params to numbers
      const providerOffsetNum = parseInt(providerOffset);
      const gameOffsetNum = parseInt(gameOffset);
      const limitNum = parseInt(limit);
      
      // Get providers for this page (3 providers per page)
      const providersPerPage = 3;
      const startIndex = providerOffsetNum * providersPerPage;
      const providersForPage = providers.slice(startIndex, startIndex + providersPerPage);
      
      if (providersForPage.length === 0) {
        return res.json({
          status: "success",
          data: [],
          pagination: {
            hasMore: false,
            providerOffset: providerOffsetNum,
            gameOffset: gameOffsetNum,
            limit: limitNum
          }
        });
      }
      
      // Generate games for each provider
      const data = providersForPage.map((provider, index) => {
        // For the first provider in the request, apply gameOffset
        const isFirstProvider = index === 0;
        const gameCount = limitNum;
        
        const games = isFirstProvider 
          ? generateGames(provider.providerName, gameCount).slice(
              gameOffsetNum, 
              gameOffsetNum + gameCount
            )
          : generateGames(provider.providerName, gameCount);
          
        return {
          providerName: provider.providerName,
          games: games
        };
      });
      
      // Determine if there's more data
      const hasMoreProviders = startIndex + providersPerPage < providers.length;
      const hasMoreGames = gameOffsetNum + limitNum < 50; // Assume max 50 games per provider
      
      const hasMore = hasMoreProviders || hasMoreGames;
      
      return res.json({
        status: "success",
        data: data,
        pagination: {
          hasMore: hasMore,
          providerOffset: providerOffsetNum,
          gameOffset: gameOffsetNum,
          limit: limitNum
        }
      });
    } catch (error) {
      console.error('Error in progressive loading endpoint:', error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error"
      });
    }
  }, 300); // Simulate network delay
});

// Start server
app.listen(PORT, () => {
  console.log(`Casino backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/gap-casino-game/providers/progressive (progressive loading of casino games)');
  console.log('Query parameters: providerOffset, gameOffset, limit');
});