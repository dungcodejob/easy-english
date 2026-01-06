import { WordRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  JsonType,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { WordPronunciationEntity } from './word-pronunciation.entity';
import { WordSenseEntity } from './word-sense.entity';
import { Language } from './workspace.entity';

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

  @Property({ nullable: true })
  rank?: number;

  @Property({ nullable: true })
  frequency?: number;

  @Property({ default: 'cambridge' })
  source: string = 'cambridge';

  @Property({ type: JsonType, nullable: true })
  inflects?: {
    NNS?: string[];
    VBD?: string[];
    VBG?: string[];
    VBP?: string[];
    VBZ?: string[];
    JJR?: string[];
    JJS?: string[];
    RBR?: string[];
    RBS?: string[];
  };

  @Property({ type: JsonType, nullable: true })
  wordFamily?: {
    n?: string[];
    v?: string[];
    adj?: string[];
    adv?: string[];
    head: string;
  };

  @Property({ nullable: true, fieldName: 'update_by' })
  updateBy?: string;

  @OneToMany(
    () => WordPronunciationEntity,
    (pronunciation) => pronunciation.word,
  )
  pronunciations = new Collection<WordPronunciationEntity>(this);

  @OneToMany(() => WordSenseEntity, (sense) => sense.word)
  senses = new Collection<WordSenseEntity>(this);

  [EntityRepositoryType]?: WordRepository;

  constructor(data: Partial<WordEntity>) {
    super();
    this.id = v7();
    this.text = data.text!;
    this.normalizedText = data.normalizedText!;
    if (data.language) this.language = data.language;

    Object.assign(this, data);
  }
}
