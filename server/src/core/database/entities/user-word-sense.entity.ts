import { UserWordSenseRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  JsonType,
  ManyToOne,
  Property,
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
// @Unique({ properties: ['userId', 'word', 'partOfSpeech'] }) // Removed for multi-topic support
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

  @Property({ fieldName: 'definition_vi', type: 'text', nullable: true })
  definitionVi?: string;

  @Property({ type: JsonType, nullable: true })
  examples?: string[] | null;

  @Property({ nullable: true })
  pronunciation?: string;

  @Property({ fieldName: 'pronunciation_uk', nullable: true })
  pronunciationUk?: string;

  @Property({ fieldName: 'pronunciation_us', nullable: true })
  pronunciationUs?: string;

  @Property({ fieldName: 'audio_uk', nullable: true })
  audioUk?: string;

  @Property({ fieldName: 'audio_us', nullable: true })
  audioUs?: string;

  @Property({ type: JsonType, nullable: true })
  images?: string[];

  @Property({ type: JsonType, nullable: true })
  collocations?: string[];

  @Property({ type: JsonType, nullable: true })
  relatedWords?: string[];

  @Property({ type: JsonType, nullable: true })
  idioms?: string[];

  @Property({ type: JsonType, nullable: true })
  phrases?: string[];

  @Property({ type: JsonType, nullable: true })
  verbPhrases?: string[];

  @Property({ fieldName: 'cefr_level', nullable: true })
  cefrLevel?: string;

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

  @Property({ fieldName: 'is_custom_word', default: true })
  isCustomWord: boolean = true;

  [EntityRepositoryType]?: UserWordSenseRepository;

  constructor(data: Partial<UserWordSenseEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
    // Ensure array/object initialization if needed, though Object.assign handles provided data.
  }
}
