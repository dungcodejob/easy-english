export interface DomainEvent {
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly eventName: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly occurredOn: Date;
  readonly aggregateId: string;
  abstract readonly eventName: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }
}
