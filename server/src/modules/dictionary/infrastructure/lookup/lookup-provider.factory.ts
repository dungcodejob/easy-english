import { DictionarySource } from '@app/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LookupProvider } from '../../domain/lookup/lookup-provider.interface';
import { FreeDictionaryProvider } from './providers/free-dictionary/free-dictionary.provider';
import { OxfordProvider } from './providers/oxford/oxford.provider';

@Injectable()
export class LookupProviderFactory {
  constructor(
    private readonly oxfordProvider: OxfordProvider,
    private readonly freeDictionaryProvider: FreeDictionaryProvider,
  ) {}

  getProvider(source?: DictionarySource): LookupProvider {
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
