import {
  ApiEndpointType,
  ApiProvider,
  ApiResponseCacheEntity,
  WordEntity,
} from '@app/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AzVocabSearchResponseDto } from '../providers';
import { WordBackfillExtractor } from './word-backfill-extractor.interface';

export interface BackfillOptions {
  batchSize?: number;
  dryRun?: boolean;
}

export interface BackfillResult {
  totalProcessed: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
}

@Injectable()
export class WordBackfillService {
  private readonly logger = new Logger(WordBackfillService.name);

  constructor(
    private readonly em: EntityManager,
    @Inject('WORD_BACKFILL_EXTRACTORS')
    private readonly extractors: WordBackfillExtractor[],
  ) {}

  async backfillWordFamily(options: BackfillOptions): Promise<BackfillResult> {
    const batchSize = options.batchSize || 100;
    const isDryRun = options.dryRun || false;
    let offset = 0;
    let hasMore = true;

    const result: BackfillResult = {
      totalProcessed: 0,
      updatedCount: 0,
      skippedCount: 0,
      errorCount: 0,
    };

    this.logger.log(
      `Starting backfillWordFamily. BatchSize: ${batchSize}, DryRun: ${isDryRun}`,
    );

    // Fork EntityManager for CLI context (avoids global context error)
    const em = this.em.fork();

    while (hasMore) {
      // 1. Fetch batch of cached responses
      const cacheEntries = await em.getRepository(ApiResponseCacheEntity).find(
        {
          endpointType: ApiEndpointType.DEFINITION,
          statusCode: 200,
        },
        {
          limit: batchSize,
          offset,
          orderBy: { id: 'ASC' },
        },
      );

      if (cacheEntries.length === 0) {
        hasMore = false;
        break;
      }

      this.logger.log(
        `Processing batch ${offset} - ${offset + cacheEntries.length}`,
      );

      // Process batch
      for (const entry of cacheEntries) {
        result.totalProcessed++;
        try {
          // Find matching extractor
          const extractor = this.extractors.find(
            (e) => e.provider === entry.provider,
          );

          if (!extractor) {
            // No extractor for this provider, skip
            continue;
          }

          // Extract data
          const wordFamily = extractor.extractWordFamily(entry.rawResponse);
          const inflects = extractor.extractInflects(entry.rawResponse);
          const rank = extractor.extractRank(entry.rawResponse);
          const frequency = extractor.extractFrequency(entry.rawResponse);
          if (!wordFamily) {
            result.skippedCount++;
            continue;
          }

          // Find corresponding Word aggregate
          // The requestIdentifier for DEFINITION type might be an ID or key.
          // However, we usually need to find by text / normalizedText.
          // For AzVocab, the raw response likely contains the word text.
          // Let's rely on the response content since cache identifier might be obscure.

          const wordText = this.extractWordTextFromResponse(entry);
          if (!wordText) {
            result.skippedCount++;
            continue;
          }

          // Look up WordEntity directly using forked em
          const normalizedText = wordText.toLowerCase().trim();
          const wordEntity = await em.getRepository(WordEntity).findOne({
            normalizedText,
            language: 'en',
          });

          if (!wordEntity) {
            this.logger.debug(`Word not found for text: ${wordText}`);
            result.skippedCount++;
            continue;
          }

          // Check if update is needed (Idempotency)
          if (wordEntity.wordFamily) {
            result.skippedCount++;
            continue;
          }

          // Apply Update directly to entity
          wordEntity.inflects = inflects || undefined;
          wordEntity.rank = rank || undefined;
          wordEntity.frequency = frequency || undefined;
          wordEntity.wordFamily = wordFamily;

          wordEntity.updateBy = 'migration:backfill-family';

          if (!isDryRun) {
            em.persist(wordEntity);
            result.updatedCount++;
            this.logger.debug(`Updated wordFamily for: ${wordEntity.text}`);
          } else {
            result.updatedCount++;
            this.logger.debug(
              `[DryRun] Would update wordFamily for: ${wordEntity.text}`,
            );
          }
        } catch (error) {
          result.errorCount++;
          this.logger.error(
            `Error processing cache entry ${entry.id}: ${error.message}`,
          );
        }
      }

      // Flush batch if not dry run
      if (!isDryRun) {
        await em.flush();
        em.clear(); // Clear identity map to avoid memory bloat
      }

      offset += batchSize;
    }

    this.logger.log('Backfill completed.', result);
    return result;
  }

  private extractWordTextFromResponse(
    entry: ApiResponseCacheEntity,
  ): string | null {
    if (entry.provider === ApiProvider.AZVOCAB) {
      const data = entry.rawResponse as AzVocabSearchResponseDto;
      return data?.id;
    }
    return null;
  }
}
