import { Word } from '../models';

/**
 * Word Aggregate Repository Interface
 *
 * This is the ONLY repository for the Dictionary bounded context.
 * All persistence operations for Word and its child entities
 * go through this interface.
 */
export interface IWordAggregateRepository {
  /**
   * Find a word by its unique ID
   */
  findById(id: string): Promise<Word | null>;

  /**
   * Find a word by normalized text and language
   * This is the primary lookup method
   */
  findByNormalizedText(text: string, language: string): Promise<Word | null>;

  /**
   * Find multiple words by normalized text prefix
   */
  findByPrefix(
    prefix: string,
    language: string,
    limit?: number,
  ): Promise<Word[]>;

  /**
   * Persist a word aggregate (insert or update)
   * This will cascade to all child entities
   */
  save(word: Word): Promise<void>;

  /**
   * Delete a word aggregate and all its children
   */
  delete(word: Word): Promise<void>;

  /**
   * Check if a word exists
   */
  exists(normalizedText: string, language: string): Promise<boolean>;
}

export const WORD_AGGREGATE_REPOSITORY = Symbol('IWordAggregateRepository');
