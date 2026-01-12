import { DictionarySource, Language } from '@app/entities';
import { Errors } from '@app/errors';
import { processBatch } from '@app/utils/batch-processor';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { IImportProvider, ImportResult } from '../../../domain/import';
import {
  LookupProvider,
  LookupResult,
} from '../../../domain/lookup/lookup-provider.interface';
import { Word } from '../../../domain/models/word';
import type { IWordAggregateRepository } from '../../../domain/repositories/word-aggregate.repository.interface';
import { WORD_AGGREGATE_REPOSITORY } from '../../../domain/repositories/word-aggregate.repository.interface';
import { AzVocabAdapter } from './azvocab.adapter';
import { AzVocabHttpClient } from './azvocab.http-client';
import { AzVocabDefinitionResponseDto, VocabDetailDto } from './azvocab.types';

// Rate Limiting Configuration
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 1000;

/**
 * Unified AzVocab Provider (Orchestrator)
 *
 * Responsibilities:
 * - Coordinates HttpClient, Adapter, and Repository
 * - Implements LookupProvider and IImportProvider interfaces
 * - Handles high-level logic (fast vs slow lookup, batch import)
 */
@Injectable()
export class AzVocabProvider implements LookupProvider, IImportProvider {
  readonly name = 'azvocab';
  readonly source = DictionarySource.AZVOCAB;

  private readonly logger = new Logger(AzVocabProvider.name);

  constructor(
    private readonly httpClient: AzVocabHttpClient,
    private readonly adapter: AzVocabAdapter,
    @Inject(WORD_AGGREGATE_REPOSITORY)
    private readonly wordRepo: IWordAggregateRepository,
  ) {}

  // ==================== LOOKUP FLOW ====================

  /**
   * FAST LOOKUP PATH (UI)
   * - Fetches ONLY first vocab entry
   * - Fetches max 6 definitions in parallel
   * - No artificial delay
   */
  async lookup(word: string): Promise<Result<LookupResult, Error>> {
    return this.fastLookup(word);
  }

  async fastLookup(
    word: string,
    maxDefinitions = 6,
  ): Promise<Result<LookupResult, Error>> {
    try {
      // 1. Search for the keyword via HttpClient
      const searchResults = await this.httpClient.search(word);

      if (!searchResults || searchResults.length === 0) {
        return err(Errors.LookupNotFound);
      }

      // 2. Take ONLY the first/best match for UI lookup
      const firstEntry = searchResults[0];
      const defIds = (firstEntry.defs || []).map((d) => d.id);

      // 3. Fetch definitions in PARALLEL via HttpClient
      const definitions = await this.httpClient.getDefinitionsParallel(
        defIds,
        maxDefinitions,
      );

      if (definitions.length === 0) {
        return err(Errors.LookupNotFound);
      }

      // 4. Extract vocab data from the first valid definition
      const vocabData = definitions[0]?.pageProps?.vocab || {
        vocab: firstEntry.vocab,
        pron_uk: firstEntry.pron_uk,
        pron_us: firstEntry.pron_us,
        uk: firstEntry.uk,
        us: firstEntry.us,
        dict: 'azvocab',
        source: 'azvocab',
        entries: [],
      };

      // 5. Map to Domain using Adapter
      const wordDomain = this.adapter.toWordDomain(vocabData, definitions);

      if (!wordDomain) {
        return err(Errors.LookupNotFound);
      }

      // 6. Trigger async import (fire and forget)
      void this.import(word);

      return ok({
        word: wordDomain,
        rawData: { vocabData, definitions },
      });
    } catch (error) {
      this.logger.error(`Fast lookup failed for ${word}: ${error.message}`);
      return err(Errors.DictionaryProviderError);
    }
  }

  // ==================== IMPORT FLOW ====================

  /**
   * Import a word (persist to DB)
   */
  async import(keyword: string): Promise<ImportResult[]> {
    try {
      // 1. Search and get ALL definitions (Slow Path with rate limiting)
      const result = await this.searchAndGetAllDefinitions(keyword);

      if (result.length === 0) {
        return [];
      }

      const importResults: ImportResult[] = [];

      // Track words by normalized text to handle duplicates within same batch
      const processedWords = new Map<string, Word>();

      for (const { vocabData, definitions } of result) {
        const normalizedText = vocabData.vocab.toLowerCase().trim();

        // Check if already processed in this batch
        let word = processedWords.get(normalizedText);

        if (!word) {
          // Check if word already exists in database
          const existingWord = await this.wordRepo.findByNormalizedText(
            normalizedText,
            Language.EN,
          );

          // Create Word aggregate using adapter (Origin: EXTERNAL)
          const newWord = this.adapter.toWordDomain(vocabData, definitions);

          if (!newWord) {
            this.logger.warn(
              `Failed to create Word domain for: ${vocabData.vocab}`,
            );
            continue;
          }

          word = newWord;

          // If word exists in DB, we need to associate this external word with the existing ID
          // to perform an update instead of insert.
          if (existingWord) {
            word.identify(existingWord.id);
          }

          processedWords.set(normalizedText, word);
        } else {
          // Word already processed in this batch - merge new senses
          // Note: Since we don't have a merge() method on Word, we recreate a temp domain
          // and manually add senses. Ideally Word domain should handle merging.
          const tempWord = this.adapter.toWordDomain(vocabData, definitions);
          if (tempWord) {
            for (const sense of tempWord.senses) {
              word.addSense({
                cefrLevel: sense.cefrLevel,
                collocations: sense.collocations,
                examples: sense.examples.map((e) => ({
                  text: e.text,
                  externalId: e.externalId,
                })),
                definitionVi: sense.definitionVi,
                id: sense.id,
                idioms: sense.idioms,
                images: sense.images,
                phrases: sense.phrases,
                relatedWords: sense.relatedWords,
                updateBy: sense.updateBy,
                verbPhrases: sense.verbPhrases,
                partOfSpeech: sense.partOfSpeech,
                definition: sense.definition,
                senseIndex: word.senses.length,
                source: sense.source,
                shortDefinition: sense.shortDefinition,
                synonyms: sense.synonyms,
                antonyms: sense.antonyms,
                externalId: sense.externalId,
              });
            }
          }
        }
      }

      // Persist all processed words
      for (const word of processedWords.values()) {
        await this.wordRepo.save(word);

        importResults.push({
          keyword: word.text,
          wordId: word.id,
          wordCreated: !word.isPersisted(),
          createdSenses: word.senses.length,
          createdPronunciations: word.pronunciations.length,
          createdExamples: word.senses.reduce(
            (acc, s) => acc + s.examples.length,
            0,
          ),
          skippedSenses: 0,
          totalDefinitions: word.senses.length,
        });
      }

      return importResults;
    } catch (error) {
      this.logger.error(`Import failed for ${keyword}: ${error.message}`);
      return [];
    }
  }

  /**
   * Helper to fetch all definitions with rate limiting
   */
  private async searchAndGetAllDefinitions(keyword: string): Promise<
    {
      vocabData: VocabDetailDto;
      definitions: AzVocabDefinitionResponseDto[];
    }[]
  > {
    // 1. Search via Client
    const searchResults = await this.httpClient.search(keyword);

    if (!searchResults || searchResults.length === 0) {
      return [];
    }

    this.logger.log(
      `Found ${searchResults.length} matching entries for keyword: ${keyword}`,
    );

    const result: {
      vocabData: VocabDetailDto;
      definitions: AzVocabDefinitionResponseDto[];
    }[] = [];

    await processBatch(
      searchResults,
      async (entry) => {
        const defIds = entry.defs.map((def) => def.id);

        // Use batch processor for rate-limited API calls via Client
        const definitions = await processBatch(
          defIds,
          async (defId) => {
            const defData = await this.httpClient.getDefinitionById(defId);
            return defData?.pageProps ? defData : null;
          },
          {
            batchSize: BATCH_SIZE,
            delayMs: BATCH_DELAY_MS,
            logger: this.logger,
          },
        );

        if (definitions.length === 0 || !definitions[0].pageProps?.vocab) {
          return null;
        }

        result.push({
          vocabData: definitions[0].pageProps.vocab,
          definitions,
        });
      },
      {
        batchSize: BATCH_SIZE,
        delayMs: BATCH_DELAY_MS,
        logger: this.logger,
      },
    );

    return result;
  }
}
