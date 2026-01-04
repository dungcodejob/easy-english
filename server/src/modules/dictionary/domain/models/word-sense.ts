import { WordSensePartOfSpeech } from '@app/entities';
import { v7 } from 'uuid';
import { CreateExampleData, Example, UpdateExampleData } from './example';

export interface CreateSenseData {
  partOfSpeech: WordSensePartOfSpeech | string;
  definition: string;
  senseIndex?: number;
  source: string;
  shortDefinition?: string;
  cefrLevel?: string;
  images?: string[];
  synonyms?: string[];
  antonyms?: string[];
  idioms?: string[];
  phrases?: string[];
  verbPhrases?: string[];
  collocations?: string[];
  relatedWords?: string[];
  definitionVi?: string;
  externalId?: string;
}

export interface UpdateSenseData {
  definition?: string;
  shortDefinition?: string;
  cefrLevel?: string;
  images?: string[];
  synonyms?: string[];
  antonyms?: string[];
  idioms?: string[];
  phrases?: string[];
  verbPhrases?: string[];
  collocations?: string[];
  relatedWords?: string[];
  definitionVi?: string;
}

/**
 * WordSense Entity
 * Represents a specific meaning of a word (e.g., "run" as verb vs noun)
 */
export class WordSense {
  readonly id: string;
  private _partOfSpeech: WordSensePartOfSpeech | string;
  private _definition: string;
  private _senseIndex: number;
  private _source: string;
  private _shortDefinition?: string;
  private _cefrLevel?: string;
  private _images?: string[];
  private _synonyms?: string[];
  private _antonyms?: string[];
  private _idioms?: string[];
  private _phrases?: string[];
  private _verbPhrases?: string[];
  private _collocations?: string[];
  private _relatedWords?: string[];
  private _definitionVi?: string;
  private _externalId?: string;

  private readonly _examples: Example[] = [];

  constructor(data: CreateSenseData, id?: string) {
    this.id = id ?? v7();
    this._partOfSpeech = data.partOfSpeech;
    this._definition = data.definition;
    this._senseIndex = data.senseIndex ?? 0;
    this._source = data.source;
    this._shortDefinition = data.shortDefinition;
    this._cefrLevel = data.cefrLevel;
    this._images = data.images;
    this._synonyms = data.synonyms;
    this._antonyms = data.antonyms;
    this._idioms = data.idioms;
    this._phrases = data.phrases;
    this._verbPhrases = data.verbPhrases;
    this._collocations = data.collocations;
    this._relatedWords = data.relatedWords;
    this._definitionVi = data.definitionVi;
    this._externalId = data.externalId;
  }

  // Getters
  get partOfSpeech(): WordSensePartOfSpeech | string {
    return this._partOfSpeech;
  }

  get definition(): string {
    return this._definition;
  }

  get senseIndex(): number {
    return this._senseIndex;
  }

  get source(): string {
    return this._source;
  }

  get shortDefinition(): string | undefined {
    return this._shortDefinition;
  }

  get cefrLevel(): string | undefined {
    return this._cefrLevel;
  }

  get images(): string[] | undefined {
    return this._images;
  }

  get synonyms(): string[] | undefined {
    return this._synonyms;
  }

  get antonyms(): string[] | undefined {
    return this._antonyms;
  }

  get idioms(): string[] | undefined {
    return this._idioms;
  }

  get phrases(): string[] | undefined {
    return this._phrases;
  }

  get verbPhrases(): string[] | undefined {
    return this._verbPhrases;
  }

  get collocations(): string[] | undefined {
    return this._collocations;
  }

  get relatedWords(): string[] | undefined {
    return this._relatedWords;
  }

  get definitionVi(): string | undefined {
    return this._definitionVi;
  }

  get externalId(): string | undefined {
    return this._externalId;
  }

  get examples(): ReadonlyArray<Example> {
    return [...this._examples];
  }

  // Business Methods
  update(data: UpdateSenseData): void {
    if (data.definition !== undefined) this._definition = data.definition;
    if (data.shortDefinition !== undefined)
      this._shortDefinition = data.shortDefinition;
    if (data.cefrLevel !== undefined) this._cefrLevel = data.cefrLevel;
    if (data.images !== undefined) this._images = data.images;
    if (data.synonyms !== undefined) this._synonyms = data.synonyms;
    if (data.antonyms !== undefined) this._antonyms = data.antonyms;
    if (data.idioms !== undefined) this._idioms = data.idioms;
    if (data.phrases !== undefined) this._phrases = data.phrases;
    if (data.verbPhrases !== undefined) this._verbPhrases = data.verbPhrases;
    if (data.collocations !== undefined) this._collocations = data.collocations;
    if (data.relatedWords !== undefined) this._relatedWords = data.relatedWords;
    if (data.definitionVi !== undefined) this._definitionVi = data.definitionVi;
  }

  addExample(data: CreateExampleData): Example {
    const example = new Example(data);
    this._examples.push(example);
    return example;
  }

  removeExample(exampleId: string): boolean {
    const index = this._examples.findIndex((e) => e.id === exampleId);
    if (index === -1) return false;
    this._examples.splice(index, 1);
    return true;
  }

  updateExample(exampleId: string, data: UpdateExampleData): Example | null {
    const example = this._examples.find((e) => e.id === exampleId);
    if (!example) return null;
    example.update(data);
    return example;
  }

  /**
   * Internal method for hydration from persistence
   */
  _loadExamples(examples: Example[]): void {
    this._examples.length = 0;
    this._examples.push(...examples);
  }
}
