export abstract class AggregateRoot<T = any> {
  protected readonly _id: string;
  protected props: T;
  private _events: any[] = [];

  constructor(props: T, id?: string) {
    this._id = id || this.generateId();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  protected addEvent(event: any): void {
    this._events.push(event);
  }

  public getUncommittedEvents(): any[] {
    return this._events;
  }

  public markEventsAsCommitted(): void {
    this._events = [];
  }

  protected abstract generateId(): string;

  public equals(other: AggregateRoot): boolean {
    return this._id === other._id;
  }
}
