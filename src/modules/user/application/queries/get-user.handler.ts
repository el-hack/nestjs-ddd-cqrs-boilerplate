import { QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { BaseQueryHandler } from '../../../../@core/application/query-handler.base';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@QueryHandler(GetUserQuery)
export class GetUserHandler extends BaseQueryHandler<GetUserQuery, User> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async execute(query: GetUserQuery): Promise<User> {
    this.logExecution(query);

    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${query.userId} not found`);
    }

    return user;
  }
}
