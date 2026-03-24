import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';
import {
  BaseUnitOfWorkPort,
  UnitOfWorkContext,
  UnitOfWorkOptions,
} from '@core/application/ports/base-unit-of-work.port';

class TypeOrmUnitOfWorkContext implements UnitOfWorkContext {
  constructor(private readonly manager: EntityManager) {}

  getRepository<Entity extends object>(
    entity: EntityTarget<Entity>,
  ): Repository<Entity> {
    return this.manager.getRepository(entity);
  }
}

@Injectable()
export class TypeOrmUnitOfWorkService implements BaseUnitOfWorkPort {
  constructor(private readonly dataSource: DataSource) {}

  execute<T>(
    work: (context: UnitOfWorkContext) => Promise<T>,
    options?: UnitOfWorkOptions,
  ): Promise<T> {
    if (options?.isolationLevel) {
      return this.dataSource.transaction(options.isolationLevel, (manager) =>
        work(new TypeOrmUnitOfWorkContext(manager)),
      );
    }

    return this.dataSource.transaction((manager) =>
      work(new TypeOrmUnitOfWorkContext(manager)),
    );
  }
}
