import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function verifyStudio21Games() {
  console.log('Verifying Studio 21 games in database...');
  
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
    
    // Count Studio 21 games
    const studio21GameCount = await gapCasinoRepository
      .createQueryBuilder('game')
      .where("game.providerName = 'STUDIO21'")
      .getCount();
    
    console.log(`Number of Studio 21 games in database: ${studio21GameCount}`);

    // Get a few Studio 21 games to verify
    const sampleStudio21Games = await gapCasinoRepository
      .createQueryBuilder('game')
      .where("game.providerName = 'STUDIO21'")
      .limit(5)
      .getMany();
    
    console.log('Sample Studio 21 games:');
    sampleStudio21Games.forEach((game, index) => {
      console.log(`${index + 1}. ${game.name} (${game.gameCode}) - ${game.urlThumb}`);
    });

    // Count total games
    const totalGames = await gapCasinoRepository.count();
    console.log(`Total games in database: ${totalGames}`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error verifying Studio 21 games:', error.message);
    process.exit(1);
  }
}

verifyStudio21Games();