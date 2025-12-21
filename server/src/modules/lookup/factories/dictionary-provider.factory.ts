import { Injectable, NotFoundException } from '@nestjs/common';
import { DictionaryProvider } from '../interfaces/dictionary-provider.interface';
import { OxfordProvider } from '../providers/oxford.provider';

@Injectable()
export class DictionaryProviderFactory {
  constructor(private readonly oxfordProvider: OxfordProvider) {}

  getProvider(source: string = 'oxford'): DictionaryProvider {
    switch (source.toLowerCase()) {
      case 'oxford':
        return this.oxfordProvider;
      // Future: case 'wiktionary': return this.wiktionaryProvider;
      default:
        throw new NotFoundException(
          `Dictionary provider '${source}' not supported`,
        );
    }
  }
}
