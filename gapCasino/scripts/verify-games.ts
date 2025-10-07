import { DataSource } from 'typeorm';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function verifyGames() {
  console.log('Starting game verification script...');
  
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

    // Count total games
    const totalGames = await gapCasinoRepository.count();
    console.log(`Total games in database: ${totalGames}`);

    // Get a sample of games
    const sampleGames = await gapCasinoRepository.find({
      take: 5,
      order: {
        createdAt: 'DESC'
      }
    });
    
    console.log('\nSample games (most recent 5):');
    sampleGames.forEach((game, index) => {
      console.log(`${index + 1}. ${game.name} (ID: ${game.gameId}) - ${game.providerName}`);
    });

    // Count games by provider
    const providerCounts = await gapCasinoRepository
      .createQueryBuilder('game')
      .select('game.providerName', 'provider')
      .addSelect('COUNT(*)', 'count')
      .groupBy('game.providerName')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    
    console.log('\nTop 10 providers by game count:');
    providerCounts.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.provider}: ${provider.count} games`);
    });

    await dataSource.destroy();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error(`Failed to verify games: ${error.message}`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Run the script
verifyGames();