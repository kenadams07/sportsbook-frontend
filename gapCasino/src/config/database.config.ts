import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'gapcasino.db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
}));