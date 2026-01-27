import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeormRepositoryBase } from '@core/infrastructure/orm/typeorm-repository.base';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeOrmUserRepository
  extends TypeormRepositoryBase<User, UserOrmEntity>
  implements UserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
    mapper: UserMapper,
  ) {
    super(repository, mapper);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async findAll(): Promise<User[]> {
    return this.findManyBy(undefined, { order: { createdAt: 'DESC' } });
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }

  // Méthodes utilitaires supplémentaires
  async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.findManyBy(
      { isActive: true },
      { order: { createdAt: 'DESC' } },
    );
  }
}
