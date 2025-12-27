import { NormalizedData } from '../dictionary-normalizer.service';

export interface DictionaryAdapter<T = any> {
  adapt(data: T): NormalizedData | null;
}
