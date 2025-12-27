import { WordRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v6 } from 'uuid';
import { BaseEntity } from './base.entity';
import { PronunciationEntity } from './pronunciation.entity';
import { WordSenseEntity } from './word-sense.entity';

export enum Language {
  EN = 'en',
}

@Entity({ repository: () => WordRepository })
@Unique({ properties: ['normalizedText', 'language'] })
export class WordEntity extends BaseEntity {
  @Property()
  text: string;

  @Index()
  @Property({ fieldName: 'normalized_text' })
  normalizedText: string;

  @Property({ default: Language.EN })
  language: string = Language.EN;

  @OneToMany(() => PronunciationEntity, (pronunciation) => pronunciation.word)
  pronunciations = new Collection<PronunciationEntity>(this);

  @OneToMany(() => WordSenseEntity, (sense) => sense.word)
  senses = new Collection<WordSenseEntity>(this);

  [EntityRepositoryType]?: WordRepository;

  constructor(data: Partial<WordEntity>) {
    super();
    this.id = v6();
    this.text = data.text!;
    this.normalizedText = data.normalizedText!;
    if (data.language) this.language = data.language;
  }
}
