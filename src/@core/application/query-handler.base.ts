import { IQueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { BaseQuery } from './query.base';

export abstract class BaseQueryHandler<T extends BaseQuery, R = any>
  implements IQueryHandler<T, R>
{
  protected readonly logger = new Logger(this.constructor.name);

  abstract execute(query: T): Promise<R>;

  protected logExecution(query: T): void {
    this.logger.log(
      `Executing query: ${query.constructor.name}`,
      {
        correlationId: query.correlationId,
        timestamp: query.timestamp,
      },
    );
  }
}
