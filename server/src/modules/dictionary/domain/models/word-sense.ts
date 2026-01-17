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
  partOfSpeech: string;
  definition: string;
  definitionVi?: string;
  shortDefinition?: string;
  senseIndex: number;
  source: string;
  externalId?: string;
  cefrLevel?: string;
  images: string[];
  collocations: string[];
  relatedWords: string[];
  idioms: string[];
  phrases: string[];
  verbPhrases: string[];
  synonyms: string[];
  antonyms: string[];
  updateBy?: string;
  examples: WordExample[];

  constructor(data: CreateSenseData, id?: string) {
    super(id ?? data.id);
    this.partOfSpeech = data.partOfSpeech;
    this.definition = data.definition;
    this.definitionVi = data.definitionVi;
    this.shortDefinition = data.shortDefinition;
    this.senseIndex = data.senseIndex ?? 0;
    this.source = data.source;
    this.externalId = data.externalId;
    this.cefrLevel = data.cefrLevel;
    this.images = data.images ?? [];
    this.collocations = data.collocations ?? [];
    this.relatedWords = data.relatedWords ?? [];
    this.idioms = data.idioms ?? [];
    this.phrases = data.phrases ?? [];
    this.verbPhrases = data.verbPhrases ?? [];
    this.synonyms = data.synonyms ?? [];
    this.antonyms = data.antonyms ?? [];
    this.updateBy = data.updateBy;

    this.examples = data.examples?.map((e) => new WordExample(e, e.id)) ?? [];
  }

  // Business Logic
  update(data: UpdateSenseData): void {
    if (data.partOfSpeech) this.partOfSpeech = data.partOfSpeech;
    if (data.definition) this.definition = data.definition;
    if (data.definitionVi !== undefined) this.definitionVi = data.definitionVi;
    if (data.shortDefinition !== undefined)
      this.shortDefinition = data.shortDefinition;
    if (data.senseIndex !== undefined) this.senseIndex = data.senseIndex;
    if (data.cefrLevel !== undefined) this.cefrLevel = data.cefrLevel;
    if (data.images !== undefined) this.images = data.images;
    if (data.collocations !== undefined) this.collocations = data.collocations;
    if (data.relatedWords !== undefined) this.relatedWords = data.relatedWords;
    if (data.idioms !== undefined) this.idioms = data.idioms;
    if (data.phrases !== undefined) this.phrases = data.phrases;
    if (data.verbPhrases !== undefined) this.verbPhrases = data.verbPhrases;
    if (data.synonyms !== undefined) this.synonyms = data.synonyms;
    if (data.antonyms !== undefined) this.antonyms = data.antonyms;
    if (data.updateBy !== undefined) this.updateBy = data.updateBy;
    if (data.source !== undefined) this.source = data.source;

    this.touch();
  }

  addExample(data: CreateExampleData): WordExample {
    const example = new WordExample(data);
    this.examples.push(example);
    this.touch();
    return example;
  }

  removeExample(exampleId: string): boolean {
    const index = this.examples.findIndex((e) => e.id === exampleId);
    if (index === -1) return false;
    this.examples.splice(index, 1);
    this.touch();
    return true;
  }
}
