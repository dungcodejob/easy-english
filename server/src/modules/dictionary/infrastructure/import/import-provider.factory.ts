import { IImportProvider } from '@app/domain/dictionary';
import { DictionarySource } from '@app/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AzVocabProvider } from './providers/azvocab/azvocab.provider';

@Injectable()
export class ImportProviderFactory {
  // private readonly providers: Record<DictionarySource, IImportProvider>;

  constructor(private readonly azvocabProvider: AzVocabProvider) {
    // this.providers = {
    //   [DictionarySource.AZVOCAB]: this.azvocabProvider,
    //   [DictionarySource.OXFORD]: this.oxfordProvider,
    //   [DictionarySource.DICTIONARYAPI]: this.dictionaryapiProvider,
    // };
  }

  getProvider(source: DictionarySource): IImportProvider {
    switch (source) {
      case DictionarySource.AZVOCAB:
        return this.azvocabProvider;
      default:
        throw new NotFoundException(`Import source '${source}' not supported`);
    }
  }
}
