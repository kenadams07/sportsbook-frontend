import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function updateProviderNames() {
  console.log('Updating provider names from SUNO to STUDIO21...');
  
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
    
    // Update all games with providerName 'SUNO' to 'STUDIO21'
    const result = await gapCasinoRepository
      .createQueryBuilder()
      .update(GapCasino)
      .set({ providerName: 'STUDIO21' })
      .where("providerName = 'SUNO'")
      .execute();
    
    console.log(`Updated ${result.affected} games from SUNO to STUDIO21`);
    
    // Verify the update
    const studio21Games = await gapCasinoRepository.count({
      where: {
        providerName: 'STUDIO21'
      }
    });
    
    const sunoGames = await gapCasinoRepository.count({
      where: {
        providerName: 'SUNO'
      }
    });
    
    console.log(`STUDIO21 games now: ${studio21Games}`);
    console.log(`SUNO games remaining: ${sunoGames}`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error updating provider names:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

updateProviderNames();