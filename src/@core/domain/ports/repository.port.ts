export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface SaveMany<Entity> {
  saveMany(entities: Entity[]): Promise<Entity[]>;
}

export interface FindOneById<Entity> {
  findById(id: string): Promise<Entity | null>;
}

export interface FindMany<Entity> {
  findAll(): Promise<Entity[]>;
}

export interface DeleteOne {
  delete(id: string): Promise<void>;
}

export interface Exists {
  exists(id: string): Promise<boolean>;
}

export interface RepositoryPort<Entity>
  extends
    Save<Entity>,
    SaveMany<Entity>,
    FindOneById<Entity>,
    FindMany<Entity>,
    DeleteOne,
    Exists {
  setCorrelationId(correlationId: string): this;
  withRelations(relations: string[]): this;
  withReadLock(): this;
  withWriteLock(): this;
}
