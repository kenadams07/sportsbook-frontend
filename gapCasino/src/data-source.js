require('dotenv/config');
const { DataSource } = require('typeorm');
const { resolve } = require('path');

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1478',
  database: process.env.DB_NAME || 'sportsbook',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [],
});

module.exports = { AppDataSource };