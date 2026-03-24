import { EntityTarget, Repository } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export interface UnitOfWorkContext {
  getRepository<Entity extends object>(
    entity: EntityTarget<Entity>,
  ): Repository<Entity>;
}

export interface UnitOfWorkOptions {
  isolationLevel?: IsolationLevel;
}

export interface BaseUnitOfWorkPort {
  execute<T>(
    work: (context: UnitOfWorkContext) => Promise<T>,
    options?: UnitOfWorkOptions,
  ): Promise<T>;
}
