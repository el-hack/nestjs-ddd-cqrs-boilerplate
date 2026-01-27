import { AggregateRoot, ID } from "@core/domain";

export interface EntityProps<TProps> {
  id: ID;
  props: TProps;
}

export type OrmEntityProps<OrmEntity> = Omit<OrmEntity, 'id'>;

export abstract class OrmMapperBase<
  Entity extends AggregateRoot,
  OrmEntity,
> {
  constructor(
    private entityConstructor: new (id: ID, props: any) => Entity,
    private ormEntityConstructor: new () => OrmEntity,
  ) {}

  protected abstract toDomainProps(ormEntity: OrmEntity): EntityProps<unknown>;

  protected abstract toOrmProps(entity: Entity): OrmEntityProps<OrmEntity>;

  toDomainEntity(ormEntity: OrmEntity): Entity {
    const { id, props } = this.toDomainProps(ormEntity);
    return new this.entityConstructor(id, props);
  }

  toOrmEntity(entity: Entity): OrmEntity {
    const props = this.toOrmProps(entity);
    const ormEntity = new this.ormEntityConstructor();
    Object.assign(ormEntity as object, props, {
      id: entity.id.toString(),
    });
    return ormEntity;
  }

  toDomainEntities(ormEntities: OrmEntity[]): Entity[] {
    return ormEntities.map((e) => this.toDomainEntity(e));
  }

  toOrmEntities(entities: Entity[]): OrmEntity[] {
    return entities.map((e) => this.toOrmEntity(e));
  }
}
