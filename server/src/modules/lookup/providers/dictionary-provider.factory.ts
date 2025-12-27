import { DictionarySource } from '@app/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DictionaryProvider } from './dictionary-provider.interface';
import { FreeDictionaryProvider } from './free-dictionary/free-dictionary.provider';
import { OxfordProvider } from './oxford/oxford.provider';

@Injectable()
export class DictionaryProviderFactory {
  constructor(
    private readonly oxfordProvider: OxfordProvider,
    private readonly freeDictionaryProvider: FreeDictionaryProvider,
  ) {}

  getProvider(source?: DictionarySource): DictionaryProvider {
    switch (source) {
      case DictionarySource.OXFORD:
        return this.oxfordProvider;

      case DictionarySource.DICTIONARY_API:
        return this.freeDictionaryProvider;
      default:
        throw new NotFoundException(
          `Dictionary provider '${source}' not supported`,
        );
    }
  }
}
