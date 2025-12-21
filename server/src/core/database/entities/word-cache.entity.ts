import { WordCacheRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  JsonType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntity } from './base.entity';

@Entity({ repository: () => WordCacheRepository })
@Unique({ properties: ['word', 'source'] })
export class WordCacheEntity extends BaseEntity {
  @Property()
  word: string;

  @Property()
  source: string;

  @Property({ type: JsonType, nullable: true })
  raw?: any;

  @Property({ type: 'text', nullable: true })
  definition?: string;

  @Property({ type: JsonType, nullable: true })
  definitions?: any[];

  @Property({ nullable: true })
  pronunciation?: string;

  @Property({ nullable: true })
  audioUrl?: string;

  @Property({ type: 'array', nullable: true })
  partOfSpeech?: string[];

  @Property({ type: 'array', nullable: true })
  examples?: string[];

  @Property({ type: 'array', nullable: true })
  synonyms?: string[];

  @Property({ type: 'array', nullable: true })
  antonyms?: string[];

  @Property({ type: JsonType, nullable: true })
  mediaUrls?: { images: string[]; audios: string[]; videos: string[] };

  @Property({ nullable: true })
  expiresAt?: Date;

  [EntityRepositoryType]?: WordCacheRepository;

  constructor(data: Partial<WordCacheEntity>) {
    super();
    Object.assign(this, data);
    this.id = v6();
  }
}
