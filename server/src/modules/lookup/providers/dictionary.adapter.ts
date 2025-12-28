import { NormalizedData } from '../models/lookup-result.model';

export interface DictionaryAdapter<T = any> {
  adapt(data: T): NormalizedData | null;
}
