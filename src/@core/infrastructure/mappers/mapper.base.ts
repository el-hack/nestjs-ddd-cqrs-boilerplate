export abstract class Mapper<Domain, Orm> {
  abstract toDomain(ormEntity: Orm): Domain;
  abstract toOrm(domainEntity: Domain): Orm;

  toDomainEntities(ormEntities: Orm[]): Domain[] {
    if (!ormEntities || !Array.isArray(ormEntities)) {
      return [];
    }
    
    return ormEntities
      .filter(entity => entity != null)
      .map(entity => this.toDomain(entity));
  }

  toOrmEntities(domainEntities: Domain[]): Orm[] {
    if (!domainEntities || !Array.isArray(domainEntities)) {
      return [];
    }
    
    return domainEntities
      .filter(entity => entity != null)
      .map(entity => this.toOrm(entity));
  }

  // Méthode utilitaire pour mapper de façon sécurisée
  safeToDomain(ormEntity: Orm | null | undefined): Domain | null {
    if (!ormEntity) {
      return null;
    }
    
    try {
      return this.toDomain(ormEntity);
    } catch (error) {
      console.error('Error mapping to domain:', error);
      return null;
    }
  }

  safeToOrm(domainEntity: Domain | null | undefined): Orm | null {
    if (!domainEntity) {
      return null;
    }
    
    try {
      return this.toOrm(domainEntity);
    } catch (error) {
      console.error('Error mapping to ORM:', error);
      return null;
    }
  }
}
