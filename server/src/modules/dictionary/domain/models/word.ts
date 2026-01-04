import { v7 } from 'uuid';
import { CreateExampleData } from './example';
import { CreatePronunciationData, Pronunciation } from './pronunciation';
import { CreateSenseData, UpdateSenseData, WordSense } from './word-sense';

export interface CreateWordData {
  text: string;
  normalizedText: string;
  language?: string;
  rank?: number;
  frequency?: number;
  source?: string;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  updateBy?: string;
}

export interface UpdateWordData {
  rank?: number;
  frequency?: number;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  updateBy?: string;
}

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

/**
 * Word Aggregate Root
 *
 * The central entity in the Dictionary bounded context.
 * All modifications to child entities (senses, pronunciations)
 * must go through this aggregate.
 */
export class Word {
  readonly id: string;
  private _text: string;
  private _normalizedText: string;
  private _language: string;
  private _rank?: number;
  private _frequency?: number;
  private _source: string;
  private _inflects?: WordInflects;
  private _wordFamily?: WordFamily;
  private _updateBy?: string;

  private readonly _senses: WordSense[] = [];
  private readonly _pronunciations: Pronunciation[] = [];

  constructor(data: CreateWordData, id?: string) {
    this.id = id ?? v7();
    this._text = data.text;
    this._normalizedText = data.normalizedText;
    this._language = data.language ?? 'en';
    this._rank = data.rank;
    this._frequency = data.frequency;
    this._source = data.source ?? 'cambridge';
    this._inflects = data.inflects;
    this._wordFamily = data.wordFamily;
    this._updateBy = data.updateBy;
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

  get rank(): number | undefined {
    return this._rank;
  }

  get frequency(): number | undefined {
    return this._frequency;
  }

  get source(): string {
    return this._source;
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

  get senses(): ReadonlyArray<WordSense> {
    return [...this._senses];
  }

  get pronunciations(): ReadonlyArray<Pronunciation> {
    return [...this._pronunciations];
  }

  // Business Methods - Word Updates
  update(data: UpdateWordData): void {
    if (data.rank !== undefined) this._rank = data.rank;
    if (data.frequency !== undefined) this._frequency = data.frequency;
    if (data.inflects !== undefined) this._inflects = data.inflects;
    if (data.wordFamily !== undefined) this._wordFamily = data.wordFamily;
    if (data.updateBy !== undefined) this._updateBy = data.updateBy;
  }

  // Business Methods - Senses
  addSense(data: CreateSenseData): WordSense {
    const senseIndex = data.senseIndex ?? this._senses.length;
    const sense = new WordSense({ ...data, senseIndex });
    this._senses.push(sense);
    return sense;
  }

  removeSense(senseId: string): boolean {
    const index = this._senses.findIndex((s) => s.id === senseId);
    if (index === -1) return false;
    this._senses.splice(index, 1);
    return true;
  }

  updateSense(senseId: string, data: UpdateSenseData): WordSense | null {
    const sense = this._senses.find((s) => s.id === senseId);
    if (!sense) return null;
    sense.update(data);
    return sense;
  }

  getSense(senseId: string): WordSense | undefined {
    return this._senses.find((s) => s.id === senseId);
  }

  // Business Methods - Examples (through sense)
  addExample(senseId: string, data: CreateExampleData) {
    const sense = this.getSense(senseId);
    if (!sense) throw new Error(`Sense not found: ${senseId}`);
    return sense.addExample(data);
  }

  // Business Methods - Pronunciations
  addPronunciation(data: CreatePronunciationData): Pronunciation {
    // Check for duplicate
    const existing = this._pronunciations.find(
      (p) => p.ipa === data.ipa && p.region === data.region,
    );
    if (existing) return existing;

    const pronunciation = new Pronunciation(data);
    this._pronunciations.push(pronunciation);
    return pronunciation;
  }

  removePronunciation(pronunciationId: string): boolean {
    const index = this._pronunciations.findIndex(
      (p) => p.id === pronunciationId,
    );
    if (index === -1) return false;
    this._pronunciations.splice(index, 1);
    return true;
  }

  /**
   * Internal methods for hydration from persistence.
   * These should only be called by the repository/mapper.
   */
  _loadSenses(senses: WordSense[]): void {
    this._senses.length = 0;
    this._senses.push(...senses);
  }

  _loadPronunciations(pronunciations: Pronunciation[]): void {
    this._pronunciations.length = 0;
    this._pronunciations.push(...pronunciations);
  }
}
