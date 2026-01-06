import { BaseDomainEvent } from '@app/domain';

export class WordSenseAddedEvent extends BaseDomainEvent {
  readonly eventName = 'WordSenseAdded';

  constructor(
    aggregateId: string,
    public readonly senseId: string,
    public readonly partOfSpeech: string,
  ) {
    super(aggregateId);
  }
}
