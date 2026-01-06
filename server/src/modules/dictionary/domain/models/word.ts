import { AggregateRoot } from '@app/domain';
import {
  WordCreatedEvent,
  WordSenseAddedEvent,
  WordSenseRemovedEvent,
} from '../events';
import { WordExample } from './word-example';
import { WordPronunciation } from './word-pronunciation';
import { CreateSenseData, UpdateSenseData, WordSense } from './word-sense';

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
  private _text: string;
  private _normalizedText: string;
  private _language: string;
  private _pronunciations: WordPronunciation[];
  private _senses: WordSense[];
  private _tags: string[];
  private _originalWord?: string;
  private _source: string;
  private _rank?: number;
  private _frequency?: number;
  private _inflects?: WordInflects;
  private _wordFamily?: WordFamily;
  private _updateBy?: string;

  constructor(data: CreateWordData, id?: string) {
    super(id);
    this._text = data.text;
    this._language = data.language;
    this._normalizedText = data.normalizedText ?? data.text.toLowerCase();
    this._tags = data.tags ?? [];
    this._originalWord = data.originalWord;
    this._source = data.source ?? 'cambridge';
    this._rank = data.rank;
    this._frequency = data.frequency;
    this._inflects = data.inflects;
    this._wordFamily = data.wordFamily;
    this._updateBy = data.updateBy;

    this._pronunciations =
      data.pronunciations?.map((p) => new WordPronunciation(p, p.id)) ?? [];
    this._senses =
      data.senses?.map((s, index) =>
        this.createSense({
          ...s,
          senseIndex: s.senseIndex ?? index,
          source: s.source ?? this._source,
        }),
      ) ?? [];

    // If ID was not provided, it's a new aggregate -> emit created event
    if (!id) {
      this.addDomainEvent(
        new WordCreatedEvent(this.id, this._text, this._language),
      );
    }
  }

  // Getters
  get text(): string {
    return this._text;
  }

  get normalizedText(): string {
    return this._normalizedText;
  }

  get language(): string {
    return this._language;
  }

  get pronunciations(): ReadonlyArray<WordPronunciation> {
    return [...this._pronunciations];
  }

  get senses(): ReadonlyArray<WordSense> {
    return [...this._senses];
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get originalWord(): string | undefined {
    return this._originalWord;
  }

  get source(): string {
    return this._source;
  }

  get rank(): number | undefined {
    return this._rank;
  }

  get frequency(): number | undefined {
    return this._frequency;
  }

  get inflects(): WordInflects | undefined {
    return this._inflects;
  }

  get wordFamily(): WordFamily | undefined {
    return this._wordFamily;
  }

  get updateBy(): string | undefined {
    return this._updateBy;
  }

  // Business Logic
  update(data: UpdateWordData): void {
    if (data.text) {
      this._text = data.text;
      this._normalizedText = data.text.toLowerCase();
    }
    if (data.language) this._language = data.language;
    if (data.tags) this._tags = data.tags;
    if (data.originalWord !== undefined) this._originalWord = data.originalWord;
    if (data.rank !== undefined) this._rank = data.rank;
    if (data.frequency !== undefined) this._frequency = data.frequency;
    if (data.inflects !== undefined) this._inflects = data.inflects;
    if (data.wordFamily !== undefined) this._wordFamily = data.wordFamily;
    if (data.updateBy !== undefined) this._updateBy = data.updateBy;
    if (data.source !== undefined) this._source = data.source;

    this.touch();
  }

  addPronunciation(data: CreatePronunciationData): void {
    const pronunciation = new WordPronunciation(data);
    if (!this._pronunciations.some((p) => p.equals(pronunciation))) {
      this._pronunciations.push(pronunciation);
    }
    this.touch();
  }

  removePronunciation(pronunciationId: string): void {
    this._pronunciations = this._pronunciations.filter(
      (p) => p.id !== pronunciationId,
    );
    this.touch();
  }

  private createSense(data: CreateSenseData): WordSense {
    return new WordSense(data, data.id);
  }

  addSense(data: CreateSenseData): WordSense {
    const senseIndex = data.senseIndex ?? this._senses.length;
    const senseData = {
      ...data,
      senseIndex,
      source: data.source ?? this._source,
    };

    const sense = this.createSense(senseData);
    this._senses.push(sense);

    this.addDomainEvent(
      new WordSenseAddedEvent(this.id, sense.id, String(sense.partOfSpeech)),
    );
    this.touch();
    return sense;
  }

  removeSense(senseId: string): boolean {
    const index = this._senses.findIndex((s) => s.id === senseId);
    if (index === -1) return false;
    this._senses.splice(index, 1);

    this.addDomainEvent(new WordSenseRemovedEvent(this.id, senseId));
    this.touch();
    return true;
  }

  getSense(senseId: string): WordSense | undefined {
    return this._senses.find((s) => s.id === senseId);
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
