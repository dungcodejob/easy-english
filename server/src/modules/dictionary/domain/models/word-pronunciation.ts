import { ValueObject } from '@app/domain';
import { v7 } from 'uuid';

export interface CreatePronunciationData {
  id?: string;
  audioUrl?: string;
  ipa?: string;
  region?: string;
}

export class WordPronunciation extends ValueObject<WordPronunciation> {
  readonly id: string; // Maintain ID for Persistence
  readonly audioUrl?: string;
  readonly ipa?: string;
  readonly region?: string;

  constructor(data: CreatePronunciationData, id?: string) {
    super();
    this.id = id ?? data.id ?? v7();
    this.audioUrl = data.audioUrl;
    this.ipa = data.ipa;
    this.region = data.region;
  }

  equals(other: WordPronunciation): boolean {
    return this.shallowEquals(other, ['ipa', 'region', 'audioUrl']);
  }
}
