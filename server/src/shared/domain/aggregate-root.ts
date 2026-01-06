import { DomainEvent } from './domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];
  private _version = 0;

  get version(): number {
    return this._version;
  }

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  incrementVersion(): void {
    this._version++;
  }
}
