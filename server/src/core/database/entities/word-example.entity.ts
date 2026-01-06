import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { VocabSetEntity } from './vocab-set.entity';
import { WordSenseEntity } from './word-sense.entity';

@Entity()
export class WordExampleEntity extends BaseEntity {
  @Property({ fieldName: 'external_id', nullable: true })
  externalId?: string;

  @ManyToOne(() => WordSenseEntity)
  @Index()
  sense: WordSenseEntity;

  @Property({ type: 'text' })
  text: string;

  @Property({ type: 'text', nullable: true, fieldName: 'translation_vi' })
  translationVi?: string;

  @Property({ default: 0 })
  order: number = 0;

  @ManyToMany(() => VocabSetEntity, (set) => set.examples)
  vocabSets = new Collection<VocabSetEntity>(this);

  constructor(data: Partial<WordExampleEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
