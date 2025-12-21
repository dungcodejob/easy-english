import {
  Entity,
  EntityRepositoryType,
  JsonType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
// We use forward reference for WordRepository to avoid circular dependency issues during module loading if repository imports entity
// But actually repository imports entity.
// Let's import WordRepository from @app/repositories which is just index.ts.
// Ideally we should import from local file if possible to avoid circular deps with index.ts
import { v6 } from 'uuid';
import { WordRepository } from '../repositories/word.repository'; // Import directly
import { BaseEntityWithTenant } from './base-extend.entity';
import { TopicEntity } from './topic.entity';

@Entity({ repository: () => WordRepository })
export class WordEntity extends BaseEntityWithTenant {
  @Property()
  word: string;

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

  @Property({ type: 'text', nullable: true })
  personalNote?: string;

  @Property({ type: JsonType, nullable: true })
  mediaUrls?: { images: string[]; audios: string[]; videos: string[] };

  @Property({ default: 1 })
  difficulty: number = 1;

  @Property({ type: JsonType, nullable: true })
  customFields?: Record<string, any>;

  @Property({ default: false })
  fromOxfordApi: boolean = false;

  @Property({ default: 0 })
  reviewCount: number = 0;

  @Property({ nullable: true })
  lastReviewedAt?: Date;

  @ManyToOne(() => TopicEntity)
  topic: TopicEntity;

  [EntityRepositoryType]?: WordRepository;

  constructor(data: Partial<WordEntity>) {
    super();
    Object.assign(this, data);
    this.id = v6();
  }
}
