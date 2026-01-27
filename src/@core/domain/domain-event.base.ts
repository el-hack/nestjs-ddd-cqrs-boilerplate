export interface DomainEvent {
  aggregateId: string;
  eventVersion: number;
  occurredOn: Date;
  eventType: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly aggregateId: string;
  public readonly eventVersion: number;
  public readonly occurredOn: Date;
  public readonly eventType: string;

  constructor(aggregateId: string, eventVersion: number = 1) {
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
    this.occurredOn = new Date();
    this.eventType = this.constructor.name;
  }
}
