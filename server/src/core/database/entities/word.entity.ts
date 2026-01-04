import { WordRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  JsonType,
  ManyToMany,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { IdiomEntity } from './idiom.entity';
import { PhraseEntity } from './phrase.entity';
import { PronunciationEntity } from './pronunciation.entity';
import { VerbPhraseEntity } from './verb-phrase.entity';
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

  @ManyToMany(() => IdiomEntity, (idiom) => idiom.words, { owner: true })
  idioms = new Collection<IdiomEntity>(this);

  @ManyToMany(() => PhraseEntity, (phrase) => phrase.words, { owner: true })
  phrases = new Collection<PhraseEntity>(this);

  @ManyToMany(() => VerbPhraseEntity, (vp) => vp.words, { owner: true })
  verbPhrases = new Collection<VerbPhraseEntity>(this);

  @OneToMany(() => PronunciationEntity, (pronunciation) => pronunciation.word)
  pronunciations = new Collection<PronunciationEntity>(this);

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
