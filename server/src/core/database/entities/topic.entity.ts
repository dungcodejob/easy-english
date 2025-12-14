import { TopicRepository } from '@app/repositories';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntity } from './base.entity';

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
export class TopicEntity extends BaseEntity {
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

  [EntityRepositoryType]?: TopicRepository;

  constructor(data: Partial<TopicEntity>) {
    super();
    Object.assign(this, data);
    this.id = v6();
  }
}
