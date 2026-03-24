import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  BaseUnitOfWorkPort,
  UnitOfWorkContext,
  UnitOfWorkOptions,
} from './ports/base-unit-of-work.port';

export interface ApplicationServiceInput {
  correlationId: string;
}

export abstract class ApplicationService<
  Input extends ApplicationServiceInput,
  Output,
  TUnitOfWork extends BaseUnitOfWorkPort = BaseUnitOfWorkPort,
> {
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(
    protected readonly unitOfWork: TUnitOfWork,
    protected readonly eventBus: EventBus,
  ) {}

  abstract run(input: Input, context: UnitOfWorkContext): Promise<Output>;

  execute(input: Input, options?: UnitOfWorkOptions): Promise<Output> {
    this.logger.log(
      `Executing ${this.constructor.name} with correlationId=${input.correlationId}`,
    );

    return this.unitOfWork.execute(
      (context) => this.run(input, context),
      options,
    );
  }
}
