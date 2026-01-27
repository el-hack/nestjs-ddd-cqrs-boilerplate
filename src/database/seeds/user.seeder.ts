import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../../modules/user/infrastructure/orm-entities/user.orm-entity';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(UserOrmEntity);

    const users = [
      {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      },
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`Created user: ${userData.email}`);
      }
    }
  }
}
