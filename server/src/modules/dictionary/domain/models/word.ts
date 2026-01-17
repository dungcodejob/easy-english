import { AggregateRoot } from '@app/domain';
import {
  WordCreatedEvent,
  WordSenseAddedEvent,
  WordSenseRemovedEvent,
} from '../events';
import { WordExample } from './word-example';
import { WordPronunciation } from './word-pronunciation';
import { CreateSenseData, UpdateSenseData, WordSense } from './word-sense';

export type WordOrigin = 'external' | 'persisted';

export interface WordInflects {
  NNS?: string[];
  VBD?: string[];
  VBG?: string[];
  VBP?: string[];
  VBZ?: string[];
  JJR?: string[];
  JJS?: string[];
  RBR?: string[];
  RBS?: string[];
}

export interface WordFamily {
  n?: string[];
  v?: string[];
  adj?: string[];
  adv?: string[];
  head: string;
}

export interface CreateWordData {
  externalId?: string;
  text: string;
  language: string;
  normalizedText?: string;
  pronunciations?: CreatePronunciationData[];
  senses?: CreateSenseData[];
  tags?: string[];
  originalWord?: string;
  source?: string;
  rank?: number;
  frequency?: number;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  updateBy?: string;
}

export interface CreatePronunciationData {
  id?: string;
  audioUrl?: string;
  ipa?: string;
  region?: string;
}

export interface UpdateWordData {
  text?: string;
  language?: string;
  tags?: string[];
  originalWord?: string;
  rank?: number;
  frequency?: number;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  updateBy?: string;
  source?: string;
}

export class Word extends AggregateRoot {
  text: string;
  normalizedText: string;
  language: string;
  pronunciations: WordPronunciation[];
  senses: WordSense[];
  tags: string[];
  originalWord?: string;
  source: string;
  rank?: number;
  frequency?: number;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  updateBy?: string;
  externalId?: string;
  readonly origin: WordOrigin;

  private constructor(
    data: CreateWordData,
    id: string | undefined,
    origin: WordOrigin,
  ) {
    super(id);
    this.origin = origin;
    this.text = data.text;
    this.externalId = data.externalId;
    this.language = data.language;
    this.normalizedText = data.normalizedText ?? data.text.toLowerCase();
    this.tags = data.tags ?? [];
    this.originalWord = data.originalWord;
    this.source = data.source ?? 'cambridge';
    this.rank = data.rank;
    this.frequency = data.frequency;
    this.inflects = data.inflects;
    this.wordFamily = data.wordFamily;
    this.updateBy = data.updateBy;

    this.pronunciations =
      data.pronunciations?.map((p) => new WordPronunciation(p, p.id)) ?? [];
    this.senses =
      data.senses?.map((s, index) =>
        this.createSense({
          ...s,
          senseIndex: s.senseIndex ?? index,
          source: s.source ?? this.source,
        }),
      ) ?? [];

    // If it's an external word (new), emit created event
    if (this.origin === 'external') {
      this.addDomainEvent(
        new WordCreatedEvent(this.id, this.text, this.language),
      );
    }
  }

  static createExternal(data: CreateWordData): Word {
    return new Word(data, undefined, 'external');
  }

  static rehydrate(id: string, data: CreateWordData): Word {
    return new Word(data, id, 'persisted');
  }

  isExternal(): boolean {
    return this.origin === 'external';
  }

  isPersisted(): boolean {
    return this.origin === 'persisted';
  }

  /**
   * Associates this external word with an existing persistence ID.
   * This effectively transforms this instance into an update payload for the existing entity.
   */
  identify(id: string): void {
    if (this.origin !== 'external') {
      throw new Error('Cannot identify a word that is not external');
    }
    (this as any).id = id; // Assign ID
    (this as any).origin = 'persisted'; // Mark as persisted/update
  }

  // Business Logic
  update(data: UpdateWordData): void {
    if (data.text) {
      this.text = data.text;
      this.normalizedText = data.text.toLowerCase();
    }
    if (data.language) this.language = data.language;
    if (data.tags) this.tags = data.tags;
    if (data.originalWord !== undefined) this.originalWord = data.originalWord;
    if (data.rank !== undefined) this.rank = data.rank;
    if (data.frequency !== undefined) this.frequency = data.frequency;
    if (data.inflects !== undefined) this.inflects = data.inflects;
    if (data.wordFamily !== undefined) this.wordFamily = data.wordFamily;
    if (data.updateBy !== undefined) this.updateBy = data.updateBy;
    if (data.source !== undefined) this.source = data.source;

    this.touch();
  }

  addPronunciation(data: CreatePronunciationData): void {
    const pronunciation = new WordPronunciation(data);
    if (!this.pronunciations.some((p) => p.equals(pronunciation))) {
      this.pronunciations.push(pronunciation);
    }
    this.touch();
  }

  removePronunciation(pronunciationId: string): void {
    this.pronunciations = this.pronunciations.filter(
      (p) => p.id !== pronunciationId,
    );
    this.touch();
  }

  private createSense(data: CreateSenseData): WordSense {
    return new WordSense(data, data.id);
  }

  addSense(data: CreateSenseData): WordSense {
    const senseIndex = data.senseIndex ?? this.senses.length;
    const senseData = {
      ...data,
      senseIndex,
      source: data.source ?? this.source,
    };

    const sense = this.createSense(senseData);
    this.senses.push(sense);

    this.addDomainEvent(
      new WordSenseAddedEvent(this.id, sense.id, String(sense.partOfSpeech)),
    );
    this.touch();
    return sense;
  }

  removeSense(senseId: string): boolean {
    const index = this.senses.findIndex((s) => s.id === senseId);
    if (index === -1) return false;
    this.senses.splice(index, 1);

    this.addDomainEvent(new WordSenseRemovedEvent(this.id, senseId));
    this.touch();
    return true;
  }

  getSense(senseId: string): WordSense | undefined {
    return this.senses.find((s) => s.id === senseId);
  }

  updateSense(senseId: string, data: UpdateSenseData): boolean {
    const sense = this.getSense(senseId);
    if (!sense) return false;

    sense.update(data);
    this.touch();
    return true;
  }

  addExampleToSense(
    senseId: string,
    exampleText: string,
    translation?: string,
  ): WordExample | undefined {
    const sense = this.getSense(senseId);
    if (!sense) return undefined;

    const example = sense.addExample({
      text: exampleText,
      translationVi: translation,
    });
    this.touch();
    return example;
  }

  removeExampleFromSense(senseId: string, exampleId: string): boolean {
    const sense = this.getSense(senseId);
    if (!sense) return false;

    const result = sense.removeExample(exampleId);
    if (result) this.touch();
    return result;
  }
}
