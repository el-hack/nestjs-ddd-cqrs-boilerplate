import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@core/domain/aggregate-root.base';
import { OrmMapperBase } from '../mappers/orm-mapper.base';

export type WhereCondition<OrmEntity> =
  | FindOptionsWhere<OrmEntity>
  | FindOptionsWhere<OrmEntity>[]
  | ObjectLiteral;

export abstract class TypeormRepositoryBase<
  Entity extends AggregateRoot,
  OrmEntity,
> {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly tableName: string;
  protected relations: string[] = [];
  protected lockOptions?: FindOneOptions<OrmEntity>['lock'];

  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapperBase<Entity, OrmEntity>,
  ) {
    this.tableName = repository.metadata.tableName;
  }

  withRelations(relations: string[]): this {
    this.relations = relations;
    return this;
  }

  withReadLock(): this {
    this.lockOptions = { mode: 'pessimistic_read' };
    return this;
  }

  withWriteLock(): this {
    this.lockOptions = { mode: 'pessimistic_write' };
    return this;
  }

  async save(entity: Entity): Promise<Entity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    return this.mapper.toDomainEntity(result);
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = this.mapper.toOrmEntities(entities);
    const result = await this.repository.save(ormEntities);
    return this.mapper.toDomainEntities(result);
  }

  async findOneBy(
    where: FindOptionsWhere<OrmEntity> | FindOptionsWhere<OrmEntity>[],
    options: FindOneOptions<OrmEntity> = {},
  ): Promise<Entity | null> {
    const { relations, lock, ...rest } = options;

    try {
      const found = await this.repository.findOne({
        ...rest,
        where,
        relations: relations ?? this.relations,
        lock: lock ?? this.lockOptions,
      });

      return found ? this.mapper.toDomainEntity(found) : null;
    } catch (error) {
      this.logger.error(error);
      return null;
    } finally {
      this.resetQueryContext();
    }
  }

  async findById(id: string): Promise<Entity | null> {
    return this.findOneBy({ id } as unknown as FindOptionsWhere<OrmEntity>);
  }

  async findManyBy(
    where?: FindOptionsWhere<OrmEntity> | FindOptionsWhere<OrmEntity>[],
    options: FindManyOptions<OrmEntity> = {},
  ): Promise<Entity[]> {
    const { relations, lock, ...rest } = options;

    try {
      const findOptions: FindManyOptions<OrmEntity> = {
        ...rest,
        relations: relations ?? this.relations,
        lock: lock ?? this.lockOptions,
      };

      if (where) {
        findOptions.where = where;
      }

      const result = await this.repository.find(findOptions);
      return this.mapper.toDomainEntities(result);
    } catch (error) {
      this.logger.error(error);
      return [];
    } finally {
      this.resetQueryContext();
    }
  }

  async findAll(options: FindManyOptions<OrmEntity> = {}): Promise<Entity[]> {
    return this.findManyBy(undefined, options);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new Error(`${this.tableName} with ID ${id} not found`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id } as unknown as FindOptionsWhere<OrmEntity>,
    });
    return count > 0;
  }

  protected resetQueryContext(): void {
    this.relations = [];
    this.lockOptions = undefined;
  }

  protected applyLock<T extends SelectQueryBuilder<OrmEntity>>(
    queryBuilder: T,
  ): T {
    if (!this.lockOptions) {
      return queryBuilder;
    }

    if (this.lockOptions.mode === 'optimistic') {
      queryBuilder.setLock('optimistic', this.lockOptions.version);
    } else {
      queryBuilder.setLock(
        this.lockOptions.mode,
        undefined,
        this.lockOptions.tables,
      );

      if (this.lockOptions.onLocked) {
        queryBuilder.setOnLocked(this.lockOptions.onLocked);
      }
    }

    return queryBuilder;
  }

  protected createQueryBuilderWithLockSettings(
    alias?: string,
  ): SelectQueryBuilder<OrmEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    return this.applyLock(queryBuilder);
  }
}
