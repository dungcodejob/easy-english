import type { IWordAggregateRepository } from '@app/domain/dictionary';
import { WORD_AGGREGATE_REPOSITORY, Word } from '@app/domain/dictionary';
import { DictionarySource, Language } from '@app/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { LookupProviderFactory } from '../infrastructure/lookup/lookup-provider.factory';

@Injectable()
export class LookupService {
  private readonly logger = new Logger(LookupService.name);

  constructor(
    @Inject(WORD_AGGREGATE_REPOSITORY)
    private readonly wordRepo: IWordAggregateRepository,
    private readonly providerFactory: LookupProviderFactory,
  ) {}

  async lookup(
    word: string,
    source: DictionarySource,
    language: Language,
  ): Promise<Word | null> {
    const normalizedText = word.toLowerCase().trim();

    // 1. Check existing in database
    const existing = await this.wordRepo.findByNormalizedText(
      normalizedText,
      language,
    );

    if (existing) {
      this.logger.log(`DB Hit for word: ${normalizedText}`);
      return existing;
    }

    // 2. Fetch from External API via Provider
    this.logger.log(
      `DB Miss for word: ${normalizedText}. Fetching from provider.`,
    );
    const provider = this.providerFactory.getProvider(DictionarySource.AZVOCAB);
    const result = await provider.lookup(normalizedText, language);

    return result.match(
      async ({ word: wordDomain }) => {
        return wordDomain;
      },
      (error) => {
        this.logger.error(`Provider ${source} lookup failed: ${error}`);
        return null;
      },
    );
  }
}
