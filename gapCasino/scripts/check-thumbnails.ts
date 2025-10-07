import { DataSource } from 'typeorm';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkThumbnails() {
  console.log('Checking thumbnail values...');
  
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

    // Check games with and without thumbnails
    const totalCount = await gapCasinoRepository.count();
    console.log(`Total games: ${totalCount}`);
    
    const gamesWithStatusTrue = await gapCasinoRepository.count({
      where: {
        status: true
      }
    });
    console.log(`Games with status true: ${gamesWithStatusTrue}`);
    
    // Let's check what actual values exist for urlThumb
    const thumbValues = await dataSource.query(`
      SELECT "urlThumb", COUNT(*) as count 
      FROM gap_casinos 
      GROUP BY "urlThumb" 
      ORDER BY count DESC 
      LIMIT 10
    `);
    
    console.log('Top 10 urlThumb values:');
    thumbValues.forEach((row: any) => {
      console.log(`  "${row.urlThumb}": ${row.count}`);
    });
    
    // Let's also check some sample games with status true
    const sampleGames = await gapCasinoRepository.find({
      where: {
        status: true
      },
      take: 5
    });
    
    console.log('Sample games with status true:');
    sampleGames.forEach((game, index) => {
      console.log(`  ${index + 1}. ${game.name} - urlThumb: "${game.urlThumb}"`);
    });

    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error(`Failed to check thumbnails: ${error.message}`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Run the script
checkThumbnails();