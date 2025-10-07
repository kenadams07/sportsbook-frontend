import { DataSource } from 'typeorm';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function debugService() {
  console.log('Debugging service method...');
  
  // Create a DataSource instance using the same configuration as the app
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1478',
    database: process.env.DB_NAME || 'sportsbook',
    entities: [GapCasino],
    synchronize: false,
    logging: false,
  });

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log('Database connection established');

    // Get the repository
    const gapCasinoRepository = dataSource.getRepository(GapCasino);

    // Test the exact query from our service method
    console.log('Testing query...');
    const games = await gapCasinoRepository.find({
      where: {
        status: true
      },
      order: {
        providerName: 'ASC',
        name: 'ASC',
      },
    });
    
    console.log(`Found ${games.length} games`);
    
    // Show first few games
    console.log('First 3 games:');
    games.slice(0, 3).forEach((game, index) => {
      console.log(`${index + 1}. ${game.name} (Provider: ${game.providerName})`);
    });
    
    // Group games by provider (simplified version of our service method)
    const groupedGames = {};
    const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
    
    games.slice(0, 10).forEach((game) => {  // Just first 10 for testing
      const provider = game.providerName || 'Unknown';
      
      if (!groupedGames[provider]) {
        groupedGames[provider] = {
          providerName: provider,
          games: []
        };
      }
      
      groupedGames[provider].games.push({
        id: game.id,
        gameId: game.gameId,
        name: game.name,
        providerName: game.providerName
      });
    });
    
    // Convert to array and sort
    const result = Object.values(groupedGames).sort((a: any, b: any) => {
      const aIndex = priorityProviders.indexOf(a.providerName);
      const bIndex = priorityProviders.indexOf(b.providerName);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) {
        return -1;
      }
      
      if (bIndex !== -1) {
        return 1;
      }
      
      return a.providerName.localeCompare(b.providerName);
    });
    
    console.log('Grouped result:');
    console.log(JSON.stringify(result, null, 2));

    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error(`Failed to debug service: ${error.message}`);
    console.error(error.stack);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Run the script
debugService();