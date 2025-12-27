import {
  DictionarySource,
  Language,
  PronunciationEntity,
  WordCacheEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DictionaryProviderFactory } from './providers';

@Injectable()
export class LookupService {
  private readonly logger = new Logger(LookupService.name);

  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly _unitOfWork: UnitOfWork,
    private readonly providerFactory: DictionaryProviderFactory,
  ) {}

  async lookup(
    word: string,
    source: DictionarySource,
    language: Language,
  ): Promise<WordEntity | null> {
    const normalizedText = word.toLowerCase().trim();

    // 1. Level 1 Cache: Check 'words' table (Normalized DB)
    const existingWord = await this._unitOfWork.word.findOne(
      { normalizedText, language },
      { populate: ['pronunciations', 'senses'] },
    );

    if (existingWord) {
      this.logger.log(`DB Hit for word: ${normalizedText}`);
      return existingWord;
    }

    // 2. Fetch from External API via Provider (Provider handles adapter internally)
    this.logger.log(
      `DB Miss for word: ${normalizedText}. Fetching from provider.`,
    );
    const provider = this.providerFactory.getProvider(source);
    if (!provider) {
      this.logger.error(`Provider ${source} not found`);
      return null;
    }

    const normalizedData = await provider.lookup(normalizedText, language);

    if (!normalizedData) {
      // Word not found in provider
      return null;
    }

    // Note: We could save raw data to word_cache here if provider exposed it
    // For now, we skip raw cache and directly persist normalized data

    // 3. Persist to DB (Transactional)
    return await this.persistWordData(normalizedData);
  }

  private isCacheValid(cache: WordCacheEntity): boolean {
    if (!cache.expiresAt) return true;
    return cache.expiresAt > new Date();
  }

  private async saveResultToCache(
    word: string,
    source: string,
    raw: any,
  ): Promise<void> {
    try {
      const existing = await this._unitOfWork.wordCache.findOne({
        word,
        source,
      });

      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      if (existing) {
        this._unitOfWork.wordCache.assign(existing, {
          raw,
          expiresAt,
        });
      } else {
        const cacheEntry = new WordCacheEntity({
          word,
          source,
          raw,
          expiresAt,
        });
        this._unitOfWork.wordCache.create(cacheEntry);
      }
      await this._unitOfWork.save();
    } catch (e) {
      this.logger.error(`Failed to save cache: ${e.message}`);
      // Don't throw, proceed flow
    }
  }

  private async persistWordData(data: any): Promise<WordEntity> {
    return await this._unitOfWork.transaction(async () => {
      // Create Word
      const wordEntity = new WordEntity({
        text: data.word.text,
        normalizedText: data.word.normalizedText,
        language: data.word.language,
      });
      this._unitOfWork.word.create(wordEntity);

      // Create Pronunciations
      if (data.pronunciations && data.pronunciations.length > 0) {
        for (const p of data.pronunciations) {
          const pron = new PronunciationEntity({
            word: wordEntity,
            ipa: p.ipa,
            audioUrl: p.audioUrl,
            region: p.region,
          });
          this._unitOfWork.pronunciation.create(pron);
        }
      }

      // Create Senses
      if (data.senses && data.senses.length > 0) {
        for (const s of data.senses) {
          const sense = new WordSenseEntity({
            word: wordEntity,
            partOfSpeech: s.partOfSpeech,
            definition: s.definition,
            senseIndex: s.senseIndex,
            source: s.source,
            shortDefinition: s.shortDefinition,
            examples: s.examples,
            synonyms: s.synonyms,
            antonyms: s.antonyms,
          });
          this._unitOfWork.wordSense.create(sense);
        }
      }

      // Handle Conflict (Conceptually):
      // If concurrent insert happens, transaction might fail or we handle it here.
      // For now, let's assume standard flow.
      // Ideally we should try/catch UniqueConstraintError and return existing if specific error occurs.

      return wordEntity;
    });
  }
}
