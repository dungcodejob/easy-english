import { DomainEvent } from '@app/domain';

export interface IEventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: ReadonlyArray<DomainEvent>): Promise<void>;
}

export const EVENT_PUBLISHER = Symbol('IEventPublisher');
