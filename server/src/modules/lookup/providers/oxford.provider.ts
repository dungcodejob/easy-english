import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { Injectable, Logger } from '@nestjs/common';
import { OxfordAdapter } from '../adapters/oxford.adapter';
import { DictionaryProvider } from '../interfaces/dictionary-provider.interface';
import { LookupResult } from '../models/lookup-result.model';

@Injectable()
export class OxfordProvider implements DictionaryProvider {
  name = 'oxford';
  private readonly logger = new Logger(OxfordProvider.name);

  constructor(
    private readonly oxfordService: OxfordDictionaryService,
    private readonly adapter: OxfordAdapter,
  ) {}

  async lookup(word: string): Promise<LookupResult | null> {
    try {
      // Use existing service to fetch data. Note: The service also handles its own caching (memory + DB save).
      // However, for this Strategy pattern, we might want raw data or just rely on its fetching capability.
      // The requirement says "If not cached... call external API... save to cache... return".
      // Our LookupService will handle the Cache-Aside logic using WordCacheRepository.
      // So here we should ideally get RAW data to return to LookupService so IT can cache it.
      // But OxfordDictionaryService.lookupWord returns parsed/raw data depending on implementation.
      // Checking existing service: it returns `data` (raw response) and does background caching.
      // We will leverage it.

      const rawData = await this.oxfordService.lookupWord(word);
      if (!rawData) return null;

      return this.adapter.adapt(rawData);
    } catch (error) {
      this.logger.error(
        `Error in OxfordProvider lookup for ${word}: ${error.message}`,
      );
      return null;
    }
  }
}
