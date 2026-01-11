import {
  ApiEndpointType,
  ApiProvider,
  ApiResponseCacheEntity,
  DictionarySource,
  Language,
} from '@app/entities';
import { Errors } from '@app/errors';
import { processBatch } from '@app/utils/batch-processor';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { firstValueFrom } from 'rxjs';
import { IImportProvider, ImportResult } from '../../../domain/import';
import {
  LookupProvider,
  LookupResult,
} from '../../../domain/lookup/lookup-provider.interface';
import { Word } from '../../../domain/models/word';
import type { IWordAggregateRepository } from '../../../domain/repositories/word-aggregate.repository.interface';
import { WORD_AGGREGATE_REPOSITORY } from '../../../domain/repositories/word-aggregate.repository.interface';
import { AzVocabAdapter } from './azvocab.adapter';
import {
  AzVocabDefinitionResponseDto,
  AzVocabSearchResponseDto,
  VocabDetailDto,
} from './azvocab.types';

// ============ Rate Limiting Configuration ============
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 1000;

/**
 * Unified AzVocab Provider
 * Implements both LookupProvider and IImportProvider interfaces
 */
@Injectable()
export class AzVocabProvider implements LookupProvider, IImportProvider {
  readonly name = 'azvocab';
  readonly source = DictionarySource.AZVOCAB;

  private readonly logger = new Logger(AzVocabProvider.name);
  private readonly baseUrl = 'https://azvocab.ai';
  private readonly buildId = 'XA-Q-SMak7Pp_80mj4dTo';

  // Hardcoded cookie for authentication
  private readonly cookie =
    '_gcl_gs=2.1.k2$i1767103571$u268621345; _gcl_au=1.1.1178978554.1767103572; _ga=GA1.1.623100414.1767103572; _gcl_aw=GCL.1767106340.CjwKCAiAjc7KBhBvEiwAE2BDOYx9P2vtqfnKcI4dh1QfMT1KR70GVSKTrjgC6v-EHRU6T9owDwV2xxoCGxIQAvD_BwE; _ga_RTRFMR7BXM=GS2.1.s1767205969$o2$g1$t1767207355$j60$l0$h0; _azvocab_token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzY5MzAsInVpZCI6IjQxZGRmODY5LTdiZjMtNGVmNy1iMWM4LWY0YmUwMDM0M2MyZCIsIm5hbWUiOiJBbmggRMWpbmcgUGjhuqFtIFbEg24iLCJlbWFpbCI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJtb3RoZXJUb25nZSI6InZpIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NjgxNjIxOTcsImV4cCI6MTc3MDc1NDE5N30.t4C6ud3B6qzSVcWag2zlSkDOmaNQD3slmQwZ3jVmb7w; _azvocab_refresh=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3ZGE5ZWI1YS1kMzFhLTQ0NzYtYmZkZi1jZTAxYThiZTM3YzMifQ.eyJleHAiOjE3NjgzMzQ5OTYsImlhdCI6MTc2ODE2MjE5NywianRpIjoiYmYwM2Y1NGUtZTAyMi00NzI5LWEyYjktYTFhYzE1ZDk0NzE5IiwiaXNzIjoiaHR0cHM6Ly9pZC5jb250dWhvYy5jb20vcmVhbG1zL2N0aHNzbyIsImF1ZCI6Imh0dHBzOi8vaWQuY29udHVob2MuY29tL3JlYWxtcy9jdGhzc28iLCJzdWIiOiI0MWRkZjg2OS03YmYzLTRlZjctYjFjOC1mNGJlMDAzNDNjMmQiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2Nob29sIiwic2lkIjoiYWMyNWY4NjEtZjBhNS00MDgyLTkyNjgtNDVmOTJlM2ZlOTQzIiwic2NvcGUiOiJvcGVuaWQgcm9sZXMgd2ViLW9yaWdpbnMgYWNyIHNlcnZpY2VfYWNjb3VudCBwcm9maWxlIGVtYWlsIGJhc2ljIn0.6-nPuhtHYYGF5I8FfEdCZsGRzPfjy9D-VhVa-I82_CKs6rfgZITyfzxCpLW6wnF_H06oaGLk6xy5JV77YGWYlQ; _azvocab_id_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5cXJOS0dRYURnSG5CTTZFWUtoRTJBaUZpOWZxYmFJZFBUMnByMUxOZVZBIn0.eyJleHAiOjE3NjgzMzQ5OTYsImlhdCI6MTc2ODE2MjE5NywiYXV0aF90aW1lIjoxNzY4MTYyMTk2LCJqdGkiOiI1NTY1NmIwMy0zZGU0LTRhMDYtYTI4Zi1mOTcxNmZmMjQ3MmEiLCJpc3MiOiJodHRwczovL2lkLmNvbnR1aG9jLmNvbS9yZWFsbXMvY3Roc3NvIiwiYXVkIjoic2Nob29sIiwic3ViIjoiNDFkZGY4NjktN2JmMy00ZWY3LWIxYzgtZjRiZTAwMzQzYzJkIiwidHlwIjoiSUQiLCJhenAiOiJzY2hvb2wiLCJzaWQiOiJhYzI1Zjg2MS1mMGE1LTQwODItOTI2OC00NWY5MmUzZmU5NDMiLCJhdF9oYXNoIjoibUd3Y3l1MzdYQzdDN1pNd2k0a1hnUSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlbEg24gQW5oIETFqW5nIFBo4bqhbSIsInByZWZlcnJlZF91c2VybmFtZSI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiVsSDbiIsImZhbWlseV9uYW1lIjoiQW5oIETFqW5nIFBo4bqhbSIsImVtYWlsIjoiMThtYXl0aW5obW9pQGdtYWlsLmNvbSJ9.dPMhFfTmo1SPFcdRBfaG88X9Wv_gBzxcPlxWGJ0c2J0I1J5hlURnSVzHdl0i-YpY01YLyGD5r77CAmUQNOPs4q8RG8ocUroOCWNxP8YWYNM4MhQu1Ge31jayuzLmxPzN3pd3X10CzdYOrGfrbMTx2HJa-WDv6GkHfWS8NEPP4dAV-sVnGvPnWAhqDthdQlW-AOb0Gr2AfO69PPwvSatLS8K7goyu7cEjQHP4f3LBOs0P5R-VXnRi6O1gO5U2gC6Hbbhzzv94i8m5SMjqwVYOEhRz6N7pXRCNCMo59rMAHDvMBKTqlXX0RGnHE8RqLK1MxlvTByke2OMi4cmiicMBpw; _ga_RTRFMR7BXM=GS2.1.s1768162156$o26$g1$t1768162198$j18$l0$h0';

  private readonly defaultHeaders = {
    Accept: '*/*',
    'Accept-Language': 'en,vi;q=0.9,en-US;q=0.8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    Origin: 'https://azvocab.ai',
    Pragma: 'no-cache',
    Referer: 'https://azvocab.ai/dashboard',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
    'sec-ch-ua':
      '"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
  };

  constructor(
    private readonly httpService: HttpService,
    @Inject(WORD_AGGREGATE_REPOSITORY)
    private readonly wordRepo: IWordAggregateRepository,
    private readonly adapter: AzVocabAdapter,
    private readonly em: EntityManager,
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
      // 1. Search for the keyword
      const searchResults = await this.search(word);

      if (!searchResults || searchResults.length === 0) {
        return err(Errors.LookupNotFound);
      }

      // 2. Take ONLY the first/best match for UI lookup
      const firstEntry = searchResults[0];
      const defIds = (firstEntry.defs || []).map((d) => d.id);

      // 3. Fetch definitions in PARALLEL (no batch delay)
      const definitions = await this.getDefinitionsParallel(
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

      // 5. Map to Domain
      const wordDomain = this.adapter.toWordDomain(vocabData, definitions);

      if (!wordDomain) {
        return err(Errors.LookupNotFound);
      }

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
   * Import a word (persists via Word aggregate)
   */
  async import(keyword: string): Promise<ImportResult[]> {
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

        // Create Word aggregate using adapter
        const newWord = this.adapter.toWordDomain(vocabData, definitions);

        if (!newWord) {
          this.logger.warn(
            `Failed to create Word domain for: ${vocabData.vocab}`,
          );
          continue;
        }

        word = newWord;

        // If word exists in DB, update the domain's ID to match existing
        if (existingWord) {
          (word as any)._id = existingWord.id;
        }

        processedWords.set(normalizedText, word);
      } else {
        // Word already processed in this batch - merge new senses
        const newWord = this.adapter.toWordDomain(vocabData, definitions);
        if (newWord) {
          for (const sense of newWord.senses) {
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
        wordCreated: true, // Simplified for now
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
  }

  // ==================== SHARED HTTP METHODS ====================

  /**
   * Search for a word in azVocab dictionary (cache-first)
   */
  private async search(keyword: string): Promise<AzVocabSearchResponseDto[]> {
    // Check cache first
    const cached = await this.getCachedResponse<AzVocabSearchResponseDto[]>(
      ApiEndpointType.SEARCH,
      keyword,
    );
    if (cached) {
      this.logger.debug(`[Cache HIT] search: ${keyword}`);
      return cached;
    }

    this.logger.debug(`[Cache MISS] search: ${keyword} - calling API`);

    try {
      const url = `${this.baseUrl}/api/vocab/search?q=${encodeURIComponent(keyword)}`;

      const response = await firstValueFrom(
        this.httpService.post<AzVocabSearchResponseDto[]>(url, null, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            'Accept-Language': 'en,vi;q=0.9,en-US;q=0.8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            Origin: 'https://azvocab.ai',
            Pragma: 'no-cache',
            Referer: 'https://azvocab.ai/dashboard',
            Cookie: this.cookie,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
            'sec-ch-ua':
              '"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }),
      );

      const data = response.data || [];

      // Cache raw response for debugging/re-mapping
      await this.cacheApiResponse(
        ApiEndpointType.SEARCH,
        keyword,
        data,
        response.status,
      );

      return data;
    } catch (error) {
      this.logger.error(`Failed to search for keyword: ${keyword}`, error);
      throw error;
    }
  }

  /**
   * Get detailed definition for a specific definition ID
   */
  private async getDefinitionById(
    defId: string,
  ): Promise<AzVocabDefinitionResponseDto | null> {
    // Check cache first
    const cached = await this.getCachedResponse<AzVocabDefinitionResponseDto>(
      ApiEndpointType.DEFINITION,
      defId,
    );
    if (cached) {
      this.logger.debug(`[Cache HIT] definition: ${defId}`);
      return cached;
    }

    this.logger.debug(`[Cache MISS] definition: ${defId} - calling API`);

    try {
      const encodedDefId = encodeURIComponent(defId);
      const url = `${this.baseUrl}/_next/data/${this.buildId}/vi/definition/${encodedDefId}.json?id=${encodedDefId}`;

      const response = await firstValueFrom(
        this.httpService.get<AzVocabDefinitionResponseDto>(url, {
          headers: {
            Accept: '*/*',
            'x-nextjs-data': '1',
            'Accept-Language': 'en,vi;q=0.9,en-US;q=0.8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            Pragma: 'no-cache',
            Referer: `${this.baseUrl}/definition/${defId}`,
            Cookie: this.cookie,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
            purpose: 'prefetch',
            'sec-ch-ua':
              '"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
          validateStatus: (status) => status < 500, // Handle 404 gracefully
        }),
      );

      if (!response.data || !response.data.pageProps) {
        this.logger.warn(
          `Invalid definition response for ID ${defId}: ${JSON.stringify(
            response.data,
          )}`,
        );
        return null;
      }

      // Cache raw response for debugging/re-mapping
      await this.cacheApiResponse(
        ApiEndpointType.DEFINITION,
        defId,
        response.data,
        response.status,
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get definition for ID: ${defId}`, error);
      return null; // Return null mostly to continue processing other definitions
    }
  }

  /**
   * Search and get ALL detailed definitions (Slow Path)
   * Uses batch processing and delays to respect rate limits.
   */
  private async searchAndGetAllDefinitions(keyword: string): Promise<
    {
      vocabData: VocabDetailDto;
      definitions: AzVocabDefinitionResponseDto[];
    }[]
  > {
    try {
      // Step 1: Search for the keyword
      const searchResults = await this.search(keyword);

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

          // Use batch processor for rate-limited API calls
          const definitions = await processBatch(
            defIds,
            async (defId) => {
              const defData = await this.getDefinitionById(defId);
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
    } catch (error) {
      this.logger.error(
        `Failed to search and get definitions for keyword: ${keyword}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Fetch definitions in parallel with NO delay.
   * Used by Fast Lookup.
   */
  private async getDefinitionsParallel(
    defIds: string[],
    limit: number,
  ): Promise<AzVocabDefinitionResponseDto[]> {
    const idsToFetch = defIds.slice(0, limit);

    return await processBatch(
      idsToFetch,
      async (defId) => {
        const defData = await this.getDefinitionById(defId);
        return defData?.pageProps ? defData : null;
      },
      {
        batchSize: BATCH_SIZE,
        delayMs: BATCH_DELAY_MS,
        logger: this.logger,
      },
    );
  }

  /**
   * Cache raw API response for debugging and re-mapping purposes
   */
  private async cacheApiResponse(
    endpointType: ApiEndpointType,
    requestIdentifier: string,
    rawResponse: unknown,
    statusCode: number,
  ): Promise<void> {
    try {
      const responseJson = JSON.stringify(rawResponse);
      const responseSizeBytes = Buffer.byteLength(responseJson, 'utf8');

      // Use upsert to update existing or insert new
      const existing = await this.em.findOne(ApiResponseCacheEntity, {
        provider: ApiProvider.AZVOCAB,
        endpointType,
        requestIdentifier,
      });

      if (existing) {
        existing.rawResponse = rawResponse;
        existing.responseSizeBytes = responseSizeBytes;
        existing.statusCode = statusCode;
      } else {
        const entity = new ApiResponseCacheEntity({
          provider: ApiProvider.AZVOCAB,
          endpointType,
          requestIdentifier,
          rawResponse,
          responseSizeBytes,
          statusCode,
        });
        this.em.persist(entity);
      }

      await this.em.flush();
    } catch (error) {
      // Log but don't throw - caching should not break the main flow
      this.logger.warn(
        `Failed to cache API response for ${endpointType}:${requestIdentifier}: ${error}`,
      );
    }
  }

  /**
   * Get cached API response if available
   */
  private async getCachedResponse<T>(
    endpointType: ApiEndpointType,
    requestIdentifier: string,
  ): Promise<T | null> {
    try {
      const cached = await this.em.findOne(ApiResponseCacheEntity, {
        provider: ApiProvider.AZVOCAB,
        endpointType,
        requestIdentifier,
      });

      if (cached) {
        return cached.rawResponse as T;
      }

      return null;
    } catch (error) {
      this.logger.warn(
        `Failed to get cached response for ${endpointType}:${requestIdentifier}: ${error}`,
      );
      return null;
    }
  }
}
