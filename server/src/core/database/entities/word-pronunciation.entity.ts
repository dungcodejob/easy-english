import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { WordEntity } from './word.entity';

@Entity()
export class WordPronunciationEntity extends BaseEntity {
  @ManyToOne(() => WordEntity)
  @Index()
  word: WordEntity;

  @Property({ nullable: true })
  ipa?: string;

  @Property({ fieldName: 'audio_url', nullable: true })
  audioUrl?: string;

  @Property({ nullable: true })
  region?: string;

  constructor(data: Partial<WordPronunciationEntity>) {
    super();
    this.id = v7();

    Object.assign(this, data);
  }
}
