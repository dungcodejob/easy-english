import { WordCacheRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  JsonType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';

export enum DictionarySource {
  OXFORD = 'oxford',
  DICTIONARY_API = 'dictionaryapi',
  AZVOCAB = 'azvocab',
}

@Entity({ repository: () => WordCacheRepository })
@Unique({ properties: ['word', 'source'] })
export class WordCacheEntity extends BaseEntity {
  @Property()
  word: string;

  @Property()
  source: string;

  @Property({ type: JsonType })
  raw: any;

  @Property({ nullable: true })
  expiresAt?: Date;

  [EntityRepositoryType]?: WordCacheRepository;

  constructor(data: Partial<WordCacheEntity>) {
    super();
    this.id = v7();
    this.word = data.word!;
    this.source = data.source!;
    this.raw = data.raw!;
    if (data.expiresAt) this.expiresAt = data.expiresAt;
  }
}
