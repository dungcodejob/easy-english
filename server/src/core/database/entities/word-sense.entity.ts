import { WordSenseRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  JsonType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { ExampleEntity } from './example.entity';
import { VocabSetEntity } from './vocab-set.entity';
import { WordEntity } from './word.entity';

@Entity({ repository: () => WordSenseRepository })
export class WordSenseEntity extends BaseEntity {
  @ManyToOne(() => WordEntity)
  @Index()
  word: WordEntity;

  @Property({ fieldName: 'part_of_speech' })
  @Index()
  partOfSpeech: string;

  @Property({ type: 'text' })
  definition: string;

  @Property({ fieldName: 'short_definition', type: 'text', nullable: true })
  shortDefinition?: string;

  @OneToMany(() => ExampleEntity, (example) => example.sense)
  exampleEntities = new Collection<ExampleEntity>(this);

  @ManyToMany(() => VocabSetEntity, (set) => set.senses)
  vocabSets = new Collection<VocabSetEntity>(this);

  @Property({ fieldName: 'external_id', nullable: true })
  externalId?: string;

  @Property({ fieldName: 'cefr_level', nullable: true })
  cefrLevel?: string;

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

  @Property({ fieldName: 'definition_vi', type: 'text', nullable: true })
  definitionVi?: string;

  @Property({ nullable: true, fieldName: 'update_by' })
  updateBy?: string;

  @Property({ type: JsonType, nullable: true })
  synonyms?: string[] = [];

  @Property({ type: JsonType, nullable: true })
  antonyms?: string[] = [];

  @Property({ fieldName: 'sense_index' })
  senseIndex: number;

  @Property()
  source: string;

  [EntityRepositoryType]?: WordSenseRepository;

  constructor(data: Partial<WordSenseEntity>) {
    super();
    this.id = v7();

    Object.assign(this, data);
  }
}
