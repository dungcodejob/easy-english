import { BaseDomainEvent } from '@app/domain';

export class WordCreatedEvent extends BaseDomainEvent {
  readonly eventName = 'WordCreated';

  constructor(
    aggregateId: string,
    public readonly text: string,
    public readonly language: string,
  ) {
    super(aggregateId);
  }
}
