import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Domain
import { UserOrmEntity } from './infrastructure/orm-entities/user.orm-entity';

// Application
import { CreateUserHandler } from './application/commands/create-user.handler';
import { GetUserHandler } from './application/queries/get-user.handler';

// Infrastructure
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';

// Presentation
import { UserController } from './presentation/user.controller';

const commandHandlers = [CreateUserHandler];
const queryHandlers = [GetUserHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), CqrsModule],
  controllers: [UserController],
  providers: [
    // Mappers
    UserMapper,

    // Repositories
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },

    // CQRS Handlers
    ...commandHandlers,
    ...queryHandlers,
  ],
  exports: ['UserRepository'],
})
export class UserModule {}
