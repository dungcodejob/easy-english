import { Global, Module } from '@nestjs/common';
import { provideEventPublisher } from '../../domain/events/event-publisher.interface';
import { InMemoryEventPublisher } from './in-memory-event-publisher';

/**
 * Global module that provides the EventPublisher implementation
 * Import this module once at the root level to make IEventPublisher available everywhere
 */
@Global()
@Module({
  providers: [provideEventPublisher(InMemoryEventPublisher)],
  exports: [provideEventPublisher(InMemoryEventPublisher)],
})
export class EventPublisherModule {}
