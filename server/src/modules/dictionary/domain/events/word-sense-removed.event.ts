import { BaseDomainEvent } from '@app/domain';

export class WordSenseRemovedEvent extends BaseDomainEvent {
  readonly eventName = 'WordSenseRemoved';

  constructor(
    aggregateId: string,
    public readonly senseId: string,
  ) {
    super(aggregateId);
  }
}
