import { BaseDomainEvent } from '../../../../@core/domain/domain-event.base';

export class UserUpdatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly payload: {
      firstName: string;
      lastName: string;
    },
  ) {
    super(aggregateId);
  }
}
