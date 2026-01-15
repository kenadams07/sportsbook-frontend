import { AppDataSource } from './ormconfig';

async function runMigrations() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Running migrations...');
    await AppDataSource.runMigrations({ transaction: 'each' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runMigrations();