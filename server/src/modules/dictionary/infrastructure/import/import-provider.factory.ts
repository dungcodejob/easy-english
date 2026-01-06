import { IImportProvider } from '@app/domain/dictionary';
import { DictionarySource } from '@app/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AzVocabProvider } from '../providers/azvocab/azvocab.provider';

@Injectable()
export class ImportProviderFactory {
  constructor(private readonly azvocabProvider: AzVocabProvider) {}

  getProvider(source: DictionarySource): IImportProvider {
    switch (source) {
      case DictionarySource.AZVOCAB:
        return this.azvocabProvider;
      default:
        throw new NotFoundException(`Import source '${source}' not supported`);
    }
  }
}
