import { DataSource } from 'typeorm';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function insertGames() {
  console.log('Starting game insertion script...');
  
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

    // Read the JSON file
    const filePath = path.resolve(__dirname, '../mutatedData.gapcasinoschemas.json');
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    const gamesData = JSON.parse(jsonData);

    console.log(`Found ${gamesData.length} games to insert`);

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Process games in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < gamesData.length; i += batchSize) {
      const batch = gamesData.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(gamesData.length/batchSize)}`);
      
      for (const game of batch) {
        try {
          // Check if game already exists
          const existingGame = await gapCasinoRepository.findOne({
            where: {
              gameId: game.gameId,
            },
          });

          if (existingGame) {
            // Update existing game
            existingGame.name = game.name;
            existingGame.gameCode = game.gameCode;
            existingGame.category = game.category;
            existingGame.providerName = game.providerName;
            existingGame.subProviderName = game.subProviderName;
            existingGame.urlThumb = game.urlThumb;
            existingGame.status = game.status;
            existingGame.token = game.token;
            
            await gapCasinoRepository.save(existingGame);
            updatedCount++;
            if (updatedCount % 100 === 0) {
              console.log(`Updated ${updatedCount} games so far...`);
            }
          } else {
            // Create new game
            const gapCasino = new GapCasino();
            gapCasino.gameId = game.gameId;
            gapCasino.name = game.name;
            gapCasino.gameCode = game.gameCode;
            gapCasino.category = game.category;
            gapCasino.providerName = game.providerName;
            gapCasino.subProviderName = game.subProviderName;
            gapCasino.urlThumb = game.urlThumb;
            gapCasino.status = game.status;
            gapCasino.token = game.token;
            
            await gapCasinoRepository.save(gapCasino);
            insertedCount++;
            if (insertedCount % 100 === 0) {
              console.log(`Inserted ${insertedCount} games so far...`);
            }
          }
        } catch (error) {
          console.error(`Error processing game ${game.name}: ${error.message}`);
          skippedCount++;
        }
      }
    }

    console.log(`Game insertion completed:`);
    console.log(`- Inserted: ${insertedCount}`);
    console.log(`- Updated: ${updatedCount}`);
    console.log(`- Skipped: ${skippedCount}`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error(`Failed to insert games: ${error.message}`);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

// Run the script
insertGames();