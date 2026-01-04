import { Result } from 'neverthrow';

/**
 * Lookup Provider Interface
 *
 * Same as DictionaryProvider - for looking up words from external APIs.
 * Returns NormalizedData that can be mapped to Word domain.
 */
export interface LookupProvider {
  name: string;
  lookup(
    word: string,
    language?: string,
  ): Promise<Result<NormalizedData, Error>>;
}

export interface NormalizedData {
  word: {
    text: string;
    normalizedText: string;
    language: string;
  };
  pronunciations: Array<{
    ipa?: string;
    audioUrl?: string;
    region?: string;
  }>;
  senses: Array<{
    partOfSpeech: string;
    definition: string;
    shortDefinition?: string;
    examples: string[];
    synonyms: string[];
    antonyms: string[];
    senseIndex: number;
    source: string;
  }>;
}
