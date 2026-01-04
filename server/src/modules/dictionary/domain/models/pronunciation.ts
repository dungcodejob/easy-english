import { v7 } from 'uuid';

export interface CreatePronunciationData {
  ipa?: string;
  audioUrl?: string;
  region?: string;
}

/**
 * Pronunciation Value Object
 * Immutable after creation - represents a single pronunciation variant
 */
export class Pronunciation {
  readonly id: string;
  readonly ipa?: string;
  readonly audioUrl?: string;
  readonly region?: string;

  constructor(data: CreatePronunciationData, id?: string) {
    this.id = id ?? v7();
    this.ipa = data.ipa;
    this.audioUrl = data.audioUrl;
    this.region = data.region;
  }

  equals(other: Pronunciation): boolean {
    return this.ipa === other.ipa && this.region === other.region;
  }
}
