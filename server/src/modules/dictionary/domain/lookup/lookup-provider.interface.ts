import { Result } from 'neverthrow';
import { Word } from '../models/word';

/**
 * Lookup Result
 *
 * Contains the Word domain model ready to persist,
 * plus the raw API response for debugging/logging.
 */
export interface LookupResult {
  word: Word;
  rawData: unknown;
}

/**
 * Lookup Provider Interface
 *
 * Providers fetch data from external APIs and return
 * a Word domain model + raw data for debugging.
 */
export interface LookupProvider {
  name: string;
  lookup(word: string, language?: string): Promise<Result<LookupResult, Error>>;
}
