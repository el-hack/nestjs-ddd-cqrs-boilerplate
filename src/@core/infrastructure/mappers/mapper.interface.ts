export interface DomainMapper<Domain, Orm> {
  toDomain(ormEntity: Orm): Domain;
  toOrm(domainEntity: Domain): Orm;
  toDomainEntities(ormEntities: Orm[]): Domain[];
  toOrmEntities(domainEntities: Domain[]): Orm[];
}

export interface EventAwareMapper<Domain, Orm> extends DomainMapper<Domain, Orm> {
  toDomainWithEvents(ormEntity: Orm): Domain;
  toOrmPartial(domainEntity: Domain, existingOrm?: Orm): Partial<Orm>;
}
