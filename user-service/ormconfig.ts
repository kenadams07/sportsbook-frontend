import { DataSource } from 'typeorm';
import { Users } from './src/users/users.entity';
import { Currency } from './src/currency/currency.entity';
import { SportBets } from './src/sportBets/sportBets.entity';
import { ResultTransaction } from './src/resultTransaction/resultTransaction.entity';
import { Exposure } from './src/exposure/exposure.entity';
import { Events } from './src/events/events.entity';
import { Sports } from './src/sports/sports.entity';
import { Markets } from './src/markets/markets.entity';
import { Runners } from './src/runners/runners.entity';
import { SportStakeSettings } from './src/sportStakeSettings/sportStakeSettings.entity';
import { WhiteLabel } from './src/whiteLabel/whiteLabel.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
  entities: [
    Users,
    Currency,
    SportBets,
    ResultTransaction,
    Exposure,
    Events,
    Sports,
    Markets,
    Runners,
    SportStakeSettings,
    WhiteLabel,
  ],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});