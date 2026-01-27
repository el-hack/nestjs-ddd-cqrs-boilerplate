import { BaseDomainEvent } from '../../../../@core/domain/domain-event.base';

export class UserCreatedEvent extends BaseDomainEvent {
  constructor(
    aggregateId: string,
    public readonly payload: {
      email: string;
      firstName: string;
      lastName: string;
    },
  ) {
    super(aggregateId);
  }
}
