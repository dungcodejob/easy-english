import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../domain/events/domain-event';
import { IEventPublisher } from '../../domain/events/event-publisher.interface';

@Injectable()
export class InMemoryEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(InMemoryEventPublisher.name);

  async publish(event: DomainEvent): Promise<void> {
    this.logger.log(
      `[DomainEvent] ${event.eventName} occurred on aggregate ${event.aggregateId}`,
    );
    // TODO: Dispatch to handlers
  }

  async publishAll(events: ReadonlyArray<DomainEvent>): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
