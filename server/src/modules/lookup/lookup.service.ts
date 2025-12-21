import { WordCacheEntity } from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DictionaryProviderFactory } from './factories/dictionary-provider.factory';
import { LookupResult } from './models/lookup-result.model';

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
    source: string = 'oxford',
  ): Promise<LookupResult | null> {
    const normalizedWord = word.toLowerCase().trim();

    // 1. Cache-Aside: Check DB Cache first
    const cached = await this._unitOfWork.wordCache.findOne({
      word: normalizedWord,
      source: source,
    });

    if (cached && this.isCacheValid(cached)) {
      this.logger.log(`Cache hit for word: ${normalizedWord} (${source})`);
      return this.mapCacheToResult(cached);
    }

    // 2. Cache Miss: Call Provider via Strategy/Factory
    this.logger.log(
      `Cache miss for word: ${normalizedWord} (${source}). Fetching from provider.`,
    );
    const provider = this.providerFactory.getProvider(source);
    const result = await provider.lookup(normalizedWord);

    if (result) {
      // 3. Save to Cache
      // Note: OxfordService might have already saved it if we used its internal method,
      // but to be explicit about the pattern in THIS module, we save it here too or ensure it's saved.
      // Since OxfordProvider uses OxfordService which we modified to save cache, it's redundant but safe.
      // Ideally, the Provider should return pure data and THIS service manages persistence.
      // For now, let's explicitly save using our entity to ensure the pattern is followed here.

      await this.saveToCache(normalizedWord, source, result);
    }

    return result;
  }

  private isCacheValid(cache: WordCacheEntity): boolean {
    if (!cache.expiresAt) return true; // No expiration means valid
    return cache.expiresAt > new Date();
  }

  private mapCacheToResult(cache: WordCacheEntity): LookupResult {
    const result = new LookupResult();
    result.word = cache.word;
    result.source = cache.source;
    result.definition = cache.definition;
    result.pronunciation = cache.pronunciation;
    result.audioUrl = cache.audioUrl;
    result.examples = cache.examples;
    result.synonyms = cache.synonyms;
    result.antonyms = cache.antonyms;
    result.partOfSpeech = cache.partOfSpeech;
    result.raw = cache.raw;
    return result;
  }

  private async saveToCache(
    word: string,
    source: string,
    result: LookupResult,
  ): Promise<void> {
    try {
      const existing = await this._unitOfWork.wordCache.findOne({
        word,
        source,
      });

      if (existing) {
        this._unitOfWork.wordCache.assign(existing, {
          definition: result.definition,
          pronunciation: result.pronunciation,
          audioUrl: result.audioUrl,
          examples: result.examples,
          synonyms: result.synonyms,
          antonyms: result.antonyms,
          partOfSpeech: result.partOfSpeech,
          raw: result.raw,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      } else {
        const cacheEntry = new WordCacheEntity({
          word,
          source,
          definition: result.definition,
          pronunciation: result.pronunciation,
          audioUrl: result.audioUrl,
          examples: result.examples,
          synonyms: result.synonyms,
          antonyms: result.antonyms,
          partOfSpeech: result.partOfSpeech,
          raw: result.raw,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
        this._unitOfWork.wordCache.create(cacheEntry);
      }

      await this._unitOfWork.save();
    } catch (e) {
      this.logger.error(`Failed to save cache in LookupService: ${e.message}`);
    }
  }
}
