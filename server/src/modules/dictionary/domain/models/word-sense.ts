import { Entity } from '@app/domain';
import { CreateExampleData, WordExample } from './word-example';

export interface CreateSenseData {
  id?: string;
  partOfSpeech: string;
  definition: string;
  definitionVi?: string;
  shortDefinition?: string;
  source: string;
  senseIndex?: number;
  externalId?: string;
  cefrLevel?: string;
  images?: string[];
  collocations?: string[];
  relatedWords?: string[];
  idioms?: string[];
  phrases?: string[];
  verbPhrases?: string[];
  synonyms?: string[];
  antonyms?: string[];
  updateBy?: string;
  examples?: CreateExampleData[];
}

export interface UpdateSenseData {
  partOfSpeech?: string;
  definition?: string;
  definitionVi?: string;
  shortDefinition?: string;
  senseIndex?: number;
  cefrLevel?: string;
  images?: string[];
  collocations?: string[];
  relatedWords?: string[];
  idioms?: string[];
  phrases?: string[];
  verbPhrases?: string[];
  synonyms?: string[];
  antonyms?: string[];
  updateBy?: string;
  source?: string;
}

export class WordSense extends Entity {
  private _partOfSpeech: string;
  private _definition: string;
  private _definitionVi?: string;
  private _shortDefinition?: string;
  private _senseIndex: number;
  private _source: string;
  private _externalId?: string;
  private _cefrLevel?: string;
  private _images: string[];
  private _collocations: string[];
  private _relatedWords: string[];
  private _idioms: string[];
  private _phrases: string[];
  private _verbPhrases: string[];
  private _synonyms: string[];
  private _antonyms: string[];
  private _updateBy?: string;
  private _examples: WordExample[];

  constructor(data: CreateSenseData, id?: string) {
    super(id ?? data.id);
    this._partOfSpeech = data.partOfSpeech;
    this._definition = data.definition;
    this._definitionVi = data.definitionVi;
    this._shortDefinition = data.shortDefinition;
    this._senseIndex = data.senseIndex ?? 0;
    this._source = data.source;
    this._externalId = data.externalId;
    this._cefrLevel = data.cefrLevel;
    this._images = data.images ?? [];
    this._collocations = data.collocations ?? [];
    this._relatedWords = data.relatedWords ?? [];
    this._idioms = data.idioms ?? [];
    this._phrases = data.phrases ?? [];
    this._verbPhrases = data.verbPhrases ?? [];
    this._synonyms = data.synonyms ?? [];
    this._antonyms = data.antonyms ?? [];
    this._updateBy = data.updateBy;

    this._examples = data.examples?.map((e) => new WordExample(e, e.id)) ?? [];
  }

  // Getters
  get partOfSpeech(): string {
    return this._partOfSpeech;
  }

  get definition(): string {
    return this._definition;
  }

  get definitionVi(): string | undefined {
    return this._definitionVi;
  }

  get shortDefinition(): string | undefined {
    return this._shortDefinition;
  }

  get senseIndex(): number {
    return this._senseIndex;
  }

  get source(): string {
    return this._source;
  }

  get externalId(): string | undefined {
    return this._externalId;
  }

  get cefrLevel(): string | undefined {
    return this._cefrLevel;
  }

  get images(): string[] {
    return [...this._images];
  }

  get collocations(): string[] {
    return [...this._collocations];
  }

  get relatedWords(): string[] {
    return [...this._relatedWords];
  }

  get idioms(): string[] {
    return [...this._idioms];
  }

  get phrases(): string[] {
    return [...this._phrases];
  }

  get verbPhrases(): string[] {
    return [...this._verbPhrases];
  }

  get synonyms(): string[] {
    return [...this._synonyms];
  }

  get antonyms(): string[] {
    return [...this._antonyms];
  }

  get updateBy(): string | undefined {
    return this._updateBy;
  }

  get examples(): ReadonlyArray<WordExample> {
    return [...this._examples];
  }

  // Business Logic
  update(data: UpdateSenseData): void {
    if (data.partOfSpeech) this._partOfSpeech = data.partOfSpeech;
    if (data.definition) this._definition = data.definition;
    if (data.definitionVi !== undefined) this._definitionVi = data.definitionVi;
    if (data.shortDefinition !== undefined)
      this._shortDefinition = data.shortDefinition;
    if (data.senseIndex !== undefined) this._senseIndex = data.senseIndex;
    if (data.cefrLevel !== undefined) this._cefrLevel = data.cefrLevel;
    if (data.images !== undefined) this._images = data.images;
    if (data.collocations !== undefined) this._collocations = data.collocations;
    if (data.relatedWords !== undefined) this._relatedWords = data.relatedWords;
    if (data.idioms !== undefined) this._idioms = data.idioms;
    if (data.phrases !== undefined) this._phrases = data.phrases;
    if (data.verbPhrases !== undefined) this._verbPhrases = data.verbPhrases;
    if (data.synonyms !== undefined) this._synonyms = data.synonyms;
    if (data.antonyms !== undefined) this._antonyms = data.antonyms;
    if (data.updateBy !== undefined) this._updateBy = data.updateBy;
    if (data.source !== undefined) this._source = data.source;

    this.touch();
  }

  addExample(data: CreateExampleData): WordExample {
    const example = new WordExample(data);
    this._examples.push(example);
    this.touch();
    return example;
  }

  removeExample(exampleId: string): boolean {
    const index = this._examples.findIndex((e) => e.id === exampleId);
    if (index === -1) return false;
    this._examples.splice(index, 1);
    this.touch();
    return true;
  }
}
