import { BaseDomainEvent } from '@app/domain';

export class WordSenseUpdatedEvent extends BaseDomainEvent {
  readonly eventName = 'WordSenseUpdated';

  constructor(
    aggregateId: string,
    public readonly senseId: string,
  ) {
    super(aggregateId);
  }
}
