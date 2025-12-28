import { TopicRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntityWithTenant } from './base-extend.entity';
import { UserEntity } from './user.entity';

export enum TopicCategory {
  Vocabulary = 'Vocabulary',
  Grammar = 'Grammar',
  Idioms = 'Idioms',
  Phrases = 'Phrases',
  Pronunciation = 'Pronunciation',
  Listening = 'Listening',
  Speaking = 'Speaking',
  Reading = 'Reading',
  Writing = 'Writing',
}

@Entity({ repository: () => TopicRepository })
export class TopicEntity extends BaseEntityWithTenant {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Enum(() => TopicCategory)
  category: TopicCategory = TopicCategory.Vocabulary;

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

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  [EntityRepositoryType]?: TopicRepository;

  constructor(data: Partial<TopicEntity>) {
    super();
    Object.assign(this, data);
    this.id = v6();
  }
}
