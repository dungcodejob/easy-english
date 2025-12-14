import { TopicRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntityWithTenant } from './base-extend.entity';
import { WordEntity } from './word.entity';

export enum TopicCategory {
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  IDIOMS = 'IDIOMS',
  PHRASES = 'PHRASES',
  PRONUNCIATION = 'PRONUNCIATION',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  READING = 'READING',
  WRITING = 'WRITING',
}

@Entity({ repository: () => TopicRepository })
export class TopicEntity extends BaseEntityWithTenant {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => TopicCategory)
  category: TopicCategory = TopicCategory.VOCABULARY;

  @Property({ type: 'array' })
  tags: string[] = [];

  @Property()
  languagePair: string;

  @Property({ nullable: true })
  coverImageUrl?: string;

  @Property({ default: false })
  isPublic: boolean = false;

  @Property({ default: 0 })
  wordCount: number = 0;

  @Property({ nullable: true })
  shareUrl?: string;

  @OneToMany(() => WordEntity, (word) => word.topic)
  words = new Collection<WordEntity>(this);

  [EntityRepositoryType]?: TopicRepository;

  constructor(data: Partial<TopicEntity>) {
    super();
    Object.assign(this, data);
    this.id = v6();
  }
}
