import { ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BaseCommand } from './command.base';

export abstract class BaseCommandHandler<
  T extends BaseCommand,
  R = any,
> implements ICommandHandler<T, R> {
  protected readonly logger = new Logger(this.constructor.name);

  abstract execute(command: T): Promise<R>;

  protected logExecution(command: T): void {
    this.logger.log(`Executing command: ${command.constructor.name}`, {
      correlationId: command.correlationId,
      timestamp: command.timestamp,
    });
  }
}
