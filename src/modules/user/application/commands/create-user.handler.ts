import { CommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { BaseCommandHandler } from '../../../../@core/application/command-handler.base';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler extends BaseCommandHandler<
  CreateUserCommand,
  User
> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async execute(command: CreateUserCommand): Promise<User> {
    this.logExecution(command);

    const email = new Email(command.email);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = User.create({
      email,
      firstName: command.firstName,
      lastName: command.lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    this.logger.log(`User created successfully: ${savedUser.id}`);

    return savedUser;
  }
}
