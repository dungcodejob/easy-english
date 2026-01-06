import { BaseDomainEvent } from '@app/domain';

export class PronunciationAddedEvent extends BaseDomainEvent {
  readonly eventName = 'PronunciationAdded';

  constructor(
    aggregateId: string,
    public readonly pronunciationId: string,
    public readonly ipa: string | undefined,
    public readonly region: string | undefined,
  ) {
    super(aggregateId);
  }
}
