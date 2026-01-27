import dataSource from '../../../data-source';
import { DatabaseSeeder } from './database.seeder';

async function runSeeds() {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    const seeder = new DatabaseSeeder(dataSource);
    await seeder.run();

    console.log('Seeds completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds();
