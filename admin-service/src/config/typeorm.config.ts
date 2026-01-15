import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import { Currency } from '../currency/currency.entity';
import { SportBets } from '../sportBets/sportBets.entity';
import { ResultTransaction } from '../resultTransaction/resultTransaction.entity';
import { Exposure } from '../exposure/exposure.entity';
import { Events } from '../events/events.entity';
import { Sports } from '../sports/sports.entity';
import { Markets } from '../markets/markets.entity';
import { Runners } from '../runners/runners.entity';
import { SportStakeSettings } from '../sportStakeSettings/sportStakeSettings.entity';
import { WhiteLabel } from '../whiteLabel/whiteLabel.entity';
import { Leagues } from '../leagues/leagues.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
  entities: [
    User,
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
    Leagues,
  ],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});
