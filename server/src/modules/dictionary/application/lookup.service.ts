import type { IWordAggregateRepository } from '@app/domain/dictionary';
import { WORD_AGGREGATE_REPOSITORY, Word } from '@app/domain/dictionary';
import { DictionarySource, Language } from '@app/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { NormalizedData } from '../domain/lookup/lookup-provider.interface';
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
    const provider = this.providerFactory.getProvider(source);

    const normalizedData = await provider.lookup(normalizedText, language);

    return normalizedData
      .asyncMap(async (data) => await this.persistWordData(data))
      .match(
        (word) => word,
        (error) => {
          this.logger.error(`Provider ${source} lookup failed: ${error}`);
          return null;
        },
      );
  }

  /**
   * Map NormalizedData to Word domain model and persist
   */
  private async persistWordData(data: NormalizedData): Promise<Word> {
    // Create Word aggregate
    const word = new Word({
      text: data.word.text,
      normalizedText: data.word.normalizedText,
      language: data.word.language,
    });

    // Add pronunciations via aggregate methods
    for (const p of data.pronunciations) {
      word.addPronunciation({
        ipa: p.ipa,
        audioUrl: p.audioUrl,
        region: p.region,
      });
    }

    // Add senses via aggregate methods
    for (const s of data.senses) {
      const sense = word.addSense({
        partOfSpeech: s.partOfSpeech,
        definition: s.definition,
        senseIndex: s.senseIndex,
        source: s.source,
        shortDefinition: s.shortDefinition,
        synonyms: s.synonyms,
        antonyms: s.antonyms,
      });

      // Add examples if any
      for (const example of s.examples || []) {
        sense.addExample({ text: example });
      }
    }

    // Persist via repository
    await this.wordRepo.save(word);

    return word;
  }
}
