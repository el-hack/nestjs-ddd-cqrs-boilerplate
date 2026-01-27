import { ICommand } from '@nestjs/cqrs';

export abstract class BaseCommand implements ICommand {
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
