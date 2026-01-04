import { DictionarySource } from '@app/entities';
import { ImportResult } from './import-result.model';

export interface IImportProvider {
  readonly source: DictionarySource;
  import(keyword: string): Promise<ImportResult>;
}
