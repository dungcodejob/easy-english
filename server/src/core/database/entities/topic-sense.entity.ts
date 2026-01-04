import { TopicSenseRepository } from '@app/repositories';
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
import { LearningStatus } from './user-word-sense.entity';
import { WordSenseEntity } from './word-sense.entity';

@Entity({ tableName: 'topic_senses', repository: () => TopicSenseRepository })
@Unique({ properties: ['topic', 'wordSense'] })
export class TopicSenseEntity extends BaseEntity {
  @ManyToOne(() => TopicEntity)
  @Index()
  topic: TopicEntity;

  @ManyToOne(() => WordSenseEntity)
  @Index()
  wordSense: WordSenseEntity;

  @Property({ type: 'text', nullable: true })
  personalNote?: string;

  @Property({ type: JsonType, nullable: true })
  personalExamples?: string[];

  @Property({ fieldName: 'definition_vi', type: 'text', nullable: true })
  definitionVi?: string;

  @Property({ type: JsonType, nullable: true })
  customImages?: string[];

  @Property({ fieldName: 'difficulty_rating', nullable: true })
  difficultyRating?: number; // 1-5

  @Property({ type: JsonType, nullable: true })
  tags?: string[];

  @Property({ fieldName: 'order_index', default: 0 })
  orderIndex: number = 0;

  // === SRS Metadata ===
  @Enum({ items: () => LearningStatus, fieldName: 'learning_status' })
  learningStatus: LearningStatus = LearningStatus.New;

  @Property({ fieldName: 'last_review_at', type: 'date', nullable: true })
  lastReviewAt?: Date;

  @Property({ fieldName: 'review_count', default: 0 })
  reviewCount: number = 0;

  @Property({ fieldName: 'ease_factor', type: 'decimal', default: 2.5 })
  easeFactor: number = 2.5;

  @Property({ default: 0 })
  interval: number = 0;

  @Property({ fieldName: 'next_review_at', type: 'date', nullable: true })
  nextReviewAt?: Date;

  [EntityRepositoryType]?: TopicSenseRepository;

  constructor(data?: Partial<TopicSenseEntity>) {
    super();
    this.id = v7();
    if (data) {
      Object.assign(this, data);
    }
  }
}
