import { NormalizedData } from '../dictionary-normalizer.service';

import { Result } from 'neverthrow';

/**
 * Dictionary Provider Interface
 *
 * Responsibility: Fetch data from external APIs and transform to NormalizedData
 * Pattern: Used by DictionaryProviderFactory (Factory Pattern)
 *
 * Each provider encapsulates:
 * 1. Fetching raw data from its specific API
 * 2. Using its adapter to transform to NormalizedData
 *
 * This ensures the consumer (LookupService) only works with standardized data.
 */
export interface DictionaryProvider {
  name: string;
  lookup(
    word: string,
    language?: string,
  ): Promise<Result<NormalizedData, Error>>;
}
