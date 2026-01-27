export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface ReadRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface WriteRepository<T, ID> {
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}
