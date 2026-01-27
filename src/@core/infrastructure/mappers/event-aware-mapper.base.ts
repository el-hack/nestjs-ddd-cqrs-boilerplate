import { AggregateRoot } from '../../domain/aggregate-root.base';
import { Mapper } from './mapper.base';
import { EventAwareMapper } from './mapper.interface';

export abstract class EventAwareMapperBase<Domain extends AggregateRoot, Orm>
  extends Mapper<Domain, Orm>
  implements EventAwareMapper<Domain, Orm>
{
  toDomainWithEvents(ormEntity: Orm): Domain {
    const domain = this.toDomain(ormEntity);
    // Marquer les événements comme committed car ils viennent de la DB
    domain.markEventsAsCommitted();
    return domain;
  }

  abstract toOrmPartial(domainEntity: Domain, existingOrm?: Orm): Partial<Orm>;

  // Méthode utilitaire pour gérer les événements avant la persistance
  protected handleEventsBeforePersistence(domain: Domain): any[] {
    const events = domain.getUncommittedEvents();
    // Ici on pourrait publier les événements ou les stocker
    return events;
  }

  // Méthode utilitaire pour mapper avec gestion des événements
  toOrmWithEventHandling(domainEntity: Domain): Orm {
    // Récupérer les événements avant le mapping
    const events = this.handleEventsBeforePersistence(domainEntity);

    // Mapper vers ORM
    const ormEntity = this.toOrm(domainEntity);

    // Marquer les événements comme committed
    domainEntity.markEventsAsCommitted();

    return ormEntity;
  }
}
