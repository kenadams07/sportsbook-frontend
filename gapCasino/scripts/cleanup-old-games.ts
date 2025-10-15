import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function cleanupOldGames() {
  console.log('Cleaning up old games...');
  
  try {
    // Create a simple data source without full NestJS context
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [GapCasino],
      synchronize: false,
      logging: false
    });

    await dataSource.initialize();
    console.log('Database connection established');

    const gapCasinoRepository = dataSource.getRepository(GapCasino);
    
    // Count games before cleanup
    const totalGamesBefore = await gapCasinoRepository.count();
    console.log(`Total games before cleanup: ${totalGamesBefore}`);

    // Remove all non-Studio21 games
    const nonStudio21Games = await gapCasinoRepository
      .createQueryBuilder('game')
      .where("game.providerName != 'STUDIO21'")
      .getCount();
    
    console.log(`Number of non-Studio21 games to be removed: ${nonStudio21Games}`);
    
    // Remove all non-Studio21 games
    await gapCasinoRepository
      .createQueryBuilder()
      .delete()
      .from(GapCasino)
      .where("providerName != 'STUDIO21'")
      .execute();
    
    console.log('Removed all non-Studio21 games');
    
    // Count games after cleanup
    const totalGamesAfter = await gapCasinoRepository.count();
    console.log(`Total games after cleanup: ${totalGamesAfter}`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error cleaning up old games:', error.message);
    process.exit(1);
  }
}

cleanupOldGames();