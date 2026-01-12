import {
  ApiEndpointType,
  ApiProvider,
  ApiResponseCacheEntity,
} from '@app/entities';
import { processBatch } from '@app/utils/batch-processor';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  AzVocabDefinitionResponseDto,
  AzVocabSearchResponseDto,
} from './azvocab.types';

// Rate Limiting Configuration
const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 1000;

/**
 * AzVocab HTTP Client
 *
 * Responsible for:
 * - Making HTTP requests to AzVocab API
 * - Caching raw responses
 * - Handling headers and cookies
 *
 * This layer knows nothing about Domain Entities.
 */
@Injectable()
export class AzVocabHttpClient {
  private readonly logger = new Logger(AzVocabHttpClient.name);
  private readonly baseUrl = 'https://azvocab.ai';
  private readonly buildId = 'XA-Q-SMak7Pp_80mj4dTo';

  // Hardcoded cookie for authentication
  private readonly cookie =
    '_gcl_gs=2.1.k2$i1767103571$u268621345; _gcl_au=1.1.1178978554.1767103572; _ga=GA1.1.623100414.1767103572; _gcl_aw=GCL.1767106340.CjwKCAiAjc7KBhBvEiwAE2BDOYx9P2vtqfnKcI4dh1QfMT1KR70GVSKTrjgC6v-EHRU6T9owDwV2xxoCGxIQAvD_BwE; _ga_RTRFMR7BXM=GS2.1.s1767205969$o2$g1$t1767207355$j60$l0$h0; _azvocab_token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzY5MzAsInVpZCI6IjQxZGRmODY5LTdiZjMtNGVmNy1iMWM4LWY0YmUwMDM0M2MyZCIsIm5hbWUiOiJBbmggRMWpbmcgUGjhuqFtIFbEg24iLCJlbWFpbCI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJtb3RoZXJUb25nZSI6InZpIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NjgxNjIxOTcsImV4cCI6MTc3MDc1NDE5N30.t4C6ud3B6qzSVcWag2zlSkDOmaNQD3slmQwZ3jVmb7w; _azvocab_refresh=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3ZGE5ZWI1YS1kMzFhLTQ0NzYtYmZkZi1jZTAxYThiZTM3YzMifQ.eyJleHAiOjE3NjgzMzQ5OTYsImlhdCI6MTc2ODE2MjE5NywianRpIjoiYmYwM2Y1NGUtZTAyMi00NzI5LWEyYjktYTFhYzE1ZDk0NzE5IiwiaXNzIjoiaHR0cHM6Ly9pZC5jb250dWhvYy5jb20vcmVhbG1zL2N0aHNzbyIsImF1ZCI6Imh0dHBzOi8vaWQuY29udHVob2MuY29tL3JlYWxtcy9jdGhzc28iLCJzdWIiOiI0MWRkZjg2OS03YmYzLTRlZjctYjFjOC1mNGJlMDAzNDNjMmQiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2Nob29sIiwic2lkIjoiYWMyNWY4NjEtZjBhNS00MDgyLTkyNjgtNDVmOTJlM2ZlOTQzIiwic2NvcGUiOiJvcGVuaWQgcm9sZXMgd2ViLW9yaWdpbnMgYWNyIHNlcnZpY2VfYWNjb3VudCBwcm9maWxlIGVtYWlsIGJhc2ljIn0.6-nPuhtHYYGF5I8FfEdCZsGRzPfjy9D-VhVa-I82_CKs6rfgZITyfzxCpLW6wnF_H06oaGLk6xy5JV77YGWYlQ; _azvocab_id_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5cXJOS0dRYURnSG5CTTZFWUtoRTJBaUZpOWZxYmFJZFBUMnByMUxOZVZBIn0.eyJleHAiOjE3NjgzMzQ5OTYsImlhdCI6MTc2ODE2MjE5NywiYXV0aF90aW1lIjoxNzY4MTYyMTk2LCJqdGkiOiI1NTY1NmIwMy0zZGU0LTRhMDYtYTI4Zi1mOTcxNmZmMjQ3MmEiLCJpc3MiOiJodHRwczovL2lkLmNvbnR1aG9jLmNvbS9yZWFsbXMvY3Roc3NvIiwiYXVkIjoic2Nob29sIiwic3ViIjoiNDFkZGY4NjktN2JmMy00ZWY3LWIxYzgtZjRiZTAwMzQzYzJkIiwidHlwIjoiSUQiLCJhenAiOiJzY2hvb2wiLCJzaWQiOiJhYzI1Zjg2MS1mMGE1LTQwODItOTI2OC00NWY5MmUzZmU5NDMiLCJhdF9oYXNoIjoibUd3Y3l1MzdYQzdDN1pNd2k0a1hnUSIsImFjciI6IjEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlbEg24gQW5oIETFqW5nIFBo4bqhbSIsInByZWZlcnJlZF91c2VybmFtZSI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiVsSDbiIsImZhbWlseV9uYW1lIjoiQW5oIETFqW5nIFBo4bqhbSIsImVtYWlsIjoiMThtYXl0aW5obW9pQGdtYWlsLmNvbSJ9.dPMhFfTmo1SPFcdRBfaG88X9Wv_gBzxcPlxWGJ0c2J0I1J5hlURnSVzHdl0i-YpY01YLyGD5r77CAmUQNOPs4q8RG8ocUroOCWNxP8YWYNM4MhQu1Ge31jayuzLmxPzN3pd3X10CzdYOrGfrbMTx2HJa-WDv6GkHfWS8NEPP4dAV-sVnGvPnWAhqDthdQlW-AOb0Gr2AfO69PPwvSatLS8K7goyu7cEjQHP4f3LBOs0P5R-VXnRi6O1gO5U2gC6Hbbhzzv94i8m5SMjqwVYOEhRz6N7pXRCNCMo59rMAHDvMBKTqlXX0RGnHE8RqLK1MxlvTByke2OMi4cmiicMBpw; _ga_RTRFMR7BXM=GS2.1.s1768162156$o26$g1$t1768162198$j18$l0$h0';

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
  ) {}

  /**
   * Search for a word in azVocab dictionary (cache-first)
   */
  async search(keyword: string): Promise<AzVocabSearchResponseDto[]> {
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
   * Get detailed definition for a specific definition ID (cache-first)
   */
  async getDefinitionById(
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
      return null;
    }
  }

  /**
   * Fetch definitions in parallel with NO delay.
   */
  async getDefinitionsParallel(
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

  // ==================== CACHING IMPLEMENTATION ====================

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
