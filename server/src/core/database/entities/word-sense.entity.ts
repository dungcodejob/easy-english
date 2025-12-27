import { WordSenseRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Index,
  JsonType,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntity } from './base.entity';
import { WordEntity } from './word.entity';

@Entity({ repository: () => WordSenseRepository })
@Unique({ properties: ['word', 'partOfSpeech', 'senseIndex', 'source'] })
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

  @Property({ type: JsonType, nullable: true })
  examples?: string[] = [];

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
    this.id = v6();
    this.word = data.word!;
    this.partOfSpeech = data.partOfSpeech!;
    this.definition = data.definition!;
    this.senseIndex = data.senseIndex !== undefined ? data.senseIndex : 0;
    this.source = data.source!;

    if (data.shortDefinition) this.shortDefinition = data.shortDefinition;
    if (data.examples) this.examples = data.examples;
    if (data.synonyms) this.synonyms = data.synonyms;
    if (data.antonyms) this.antonyms = data.antonyms;
  }
}
