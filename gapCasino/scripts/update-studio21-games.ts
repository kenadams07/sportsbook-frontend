import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import databaseConfig from '../src/config/database.config';
import { GapCasino } from '../src/modules/games/entities/gap-casino.entity';
import { Studio21GameService } from '../src/modules/games/game-studio21.service';
import { SignatureService } from '../src/common/utils/studio21/signature-studio21.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: join(__dirname, '../.env') });

async function updateStudio21Games() {
  console.log('Starting Studio 21 games update...');
  
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
      synchronize: true, // Enable synchronization to update the database schema
      logging: false
    });

    await dataSource.initialize();
    console.log('Database connection established');

    const gapCasinoRepository = dataSource.getRepository(GapCasino);
    
    // Clear ALL existing games (not just Studio 21 games)
    await gapCasinoRepository
      .createQueryBuilder()
      .delete()
      .from(GapCasino)
      .execute();
    
    console.log('Cleared all existing games');

    // Fetch Studio 21 games directly using the API
    const studio21BaseUrl = process.env.STUDIO21_BASE_URL;
    const partnerId = process.env.STUDIO21_PARTNER_ID;
    
    if (!studio21BaseUrl || !partnerId) {
      throw new Error('Studio 21 configuration missing in environment variables');
    }

    // Create a simple signature service for this script
    const signatureService = new SignatureService();
    
    const requestData = {
      partner_id: partnerId,
    };

    const dataStringify = JSON.stringify(requestData);
    const encodedSignature = await signatureService.createSignature(dataStringify);

    const headers = {
      'Casino-Signature': encodedSignature,
      'Content-Type': 'application/json',
    };

    console.log('Fetching Studio 21 games...');
    const response = await axios.post(`${studio21BaseUrl}/games/list`, requestData, { headers });
    const studio21Games = response.data;

    console.log(`Fetched ${studio21Games.length} Studio 21 games`);

    // Insert Studio 21 games with all new fields
    let insertedCount = 0;
    if (studio21Games && Array.isArray(studio21Games)) {
      for (const game of studio21Games) {
        try {
          const gapCasinoObj = {
            gameId: game.game_id.toString(),
            name: game.name,
            gameCode: game.game_code,
            category: game.category,
            providerName: 'STUDIO21',
            subProviderName: game.product,
            status: game.enabled,
            urlThumb: game.url_thumb,
            // New fields
            product: game.product,
            platforms: game.platforms,
            freebetSupport: game.freebet_support,
            blockedCountries: game.blocked_countries,
            releaseDate: game.release_date,
            inGameFreebets: game.in_game_freebets,
            volatility: game.volatility,
            rtp: game.rtp,
            certifications: game.certifications,
            languages: game.languages,
            theme: game.theme,
            technology: game.technology,
            description: game.name,
            tags: game.category,
            features: game.technology ? game.technology.join(',') : '',
          };

          const newGame = gapCasinoRepository.create(gapCasinoObj);
          await gapCasinoRepository.save(newGame);
          insertedCount++;
        } catch (gameError) {
          console.error(`Error inserting game ${game.name}:`, gameError.message);
        }
      }
    }

    console.log(`Successfully inserted ${insertedCount} Studio 21 games`);
    
    // Count total games
    const totalGames = await gapCasinoRepository.count();
    console.log(`Total games in database: ${totalGames}`);
    
    await dataSource.destroy();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error updating Studio 21 games:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

updateStudio21Games();