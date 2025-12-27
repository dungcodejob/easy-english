import { PronunciationRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Index,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntity } from './base.entity';
import { WordEntity } from './word.entity';

@Entity({ repository: () => PronunciationRepository })
export class PronunciationEntity extends BaseEntity {
  @ManyToOne(() => WordEntity)
  @Index()
  word: WordEntity;

  @Property({ nullable: true })
  ipa?: string;

  @Property({ fieldName: 'audio_url', nullable: true })
  audioUrl?: string;

  @Property({ nullable: true })
  region?: string;

  [EntityRepositoryType]?: PronunciationRepository;

  constructor(data: Partial<PronunciationEntity>) {
    super();
    this.id = v6();
    this.word = data.word!;
    if (data.ipa) this.ipa = data.ipa;
    if (data.audioUrl) this.audioUrl = data.audioUrl;
    if (data.region) this.region = data.region;
  }
}
