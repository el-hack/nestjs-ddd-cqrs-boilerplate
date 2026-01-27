import { IQuery } from '@nestjs/cqrs';

export abstract class BaseQuery implements IQuery {
  public readonly timestamp: Date;
  public readonly correlationId: string;

  constructor(correlationId?: string) {
    this.timestamp = new Date();
    this.correlationId = correlationId || this.generateCorrelationId();
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
