import { Inject, Type } from '@nestjs/common';
import { DomainEvent } from './domain-event';

export interface IEventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: ReadonlyArray<DomainEvent>): Promise<void>;
}

const EVENT_PUBLISHER_TOKEN = Symbol('IEventPublisher');

export const InjectEventPublisher = () => Inject(EVENT_PUBLISHER_TOKEN);

export const provideEventPublisher = (
  classInstance: Type<IEventPublisher>,
) => ({
  provide: EVENT_PUBLISHER_TOKEN,
  useClass: classInstance,
});
