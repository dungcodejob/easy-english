import { LookupResult } from '../models/lookup-result.model';

export interface DictionaryProvider {
  name: string;
  lookup(word: string): Promise<LookupResult | null>;
}
