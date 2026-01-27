import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userSeeder = new UserSeeder(this.dataSource);
    await userSeeder.run();
  }
}
