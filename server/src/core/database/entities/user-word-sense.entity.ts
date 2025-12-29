import { UserWordSenseRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  JsonType,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { TopicEntity } from './topic.entity';
import { WordSenseEntity } from './word-sense.entity';
import { WorkspaceEntity } from './workspace.entity';

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum LearningStatus {
  New = 'new',
  Learning = 'learning',
  Review = 'reviewing',
  Mastered = 'mastered',
}

export interface UserWordSenseMedia {
  images?: string[];
  videos?: string[];
}

@Entity({ repository: () => UserWordSenseRepository })
@Unique({ properties: ['userId', 'word', 'partOfSpeech'] })
export class UserWordSenseEntity extends BaseEntity {
  @Property({ fieldName: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => TopicEntity)
  @Index()
  topic: TopicEntity;

  @ManyToOne(() => WorkspaceEntity)
  workspace: WorkspaceEntity;

  @Property()
  word: string;

  @Property()
  language: string;

  @Property({ fieldName: 'part_of_speech' })
  partOfSpeech: string;

  @Property({ type: 'text' })
  definition: string;

  @Property({ type: JsonType, nullable: true })
  examples?: string[] | null;

  @Property({ nullable: true })
  pronunciation?: string;

  @Property({ nullable: true })
  synonyms?: string[] | null;

  @Property({ nullable: true })
  antonyms?: string[] | null;

  @Enum({ items: () => DifficultyLevel, fieldName: 'difficulty_level' })
  difficultyLevel: DifficultyLevel = DifficultyLevel.Easy;

  @Property({ type: JsonType, nullable: true })
  media?: UserWordSenseMedia | null;

  // Learning metadata
  @Enum({ items: () => LearningStatus, fieldName: 'learning_status' })
  learningStatus: LearningStatus = LearningStatus.New;

  @Property({ type: 'date', nullable: true })
  lastReviewAt?: Date;

  @ManyToOne(() => WordSenseEntity, {
    nullable: true,
    fieldName: 'dictionary_sense_id',
  })
  dictionarySense: WordSenseEntity | null;

  [EntityRepositoryType]?: UserWordSenseRepository;

  constructor(data: Partial<UserWordSenseEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
    // Ensure array/object initialization if needed, though Object.assign handles provided data.
  }
}
