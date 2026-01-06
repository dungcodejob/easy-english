import {
  DictionarySource,
  ExampleEntity,
  Language,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { EntityManager, wrap } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IImportProvider, ImportResult } from '../../../../domain/import';
import { AzVocabAdapter } from './azvocab.adapter';
import {
  AzVocabDefinitionResponseDto,
  AzVocabSearchResponseDto,
  VocabDetailDto,
} from './azvocab.types';

// ============ Rate Limiting Configuration ============
// Delay after every BATCH_SIZE requests to avoid API spam
const BATCH_SIZE = 3; // Number of requests before delay
const BATCH_DELAY_MS = 500; // Delay in milliseconds after each batch

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
// =====================================================

@Injectable()
export class AzVocabProvider implements IImportProvider {
  readonly source = DictionarySource.AZVOCAB;
  private readonly logger = new Logger(AzVocabProvider.name);
  private readonly baseUrl = 'https://azvocab.ai';
  private readonly buildId = '_JSpT6LfxA-74vnvYXw9U'; // Should ideally be dynamic
  private readonly adapter = new AzVocabAdapter();
  private readonly cookie =
    '_gcl_gs=2.1.k2$i1767103571$u268621345; _gcl_au=1.1.1178978554.1767103572; _ga=GA1.1.623100414.1767103572; _gcl_aw=GCL.1767106340.CjwKCAiAjc7KBhBvEiwAE2BDOYx9P2vtqfnKcI4dh1QfMT1KR70GVSKTrjgC6v-EHRU6T9owDwV2xxoCGxIQAvD_BwE; _ga_RTRFMR7BXM=GS2.1.s1767205969$o2$g1$t1767207355$j60$l0$h0; _azvocab_token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzY5MzAsInVpZCI6IjQxZGRmODY5LTdiZjMtNGVmNy1iMWM4LWY0YmUwMDM0M2MyZCIsIm5hbWUiOiJBbmggRMWpbmcgUGjhuqFtIFbEg24iLCJlbWFpbCI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJtb3RoZXJUb25nZSI6InZpIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3Njc1MTY1MzcsImV4cCI6MTc3MDEwODUzN30.eb3Tp6UNaPKau_5v9LdHmqoEwQnpi6km143a0BJgF0Q; _azvocab_refresh=eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3ZGE5ZWI1YS1kMzFhLTQ0NzYtYmZkZi1jZTAxYThiZTM3YzMifQ.eyJleHAiOjE3Njc2MzQwNTAsImlhdCI6MTc2NzUxNjU1OSwianRpIjoiMDNkZjU1OTQtMDhmMS00NzYzLThlYWEtOWU0YjY2N2ZiYTcwIiwiaXNzIjoiaHR0cHM6Ly9pZC5jb250dWhvYy5jb20vcmVhbG1zL2N0aHNzbyIsImF1ZCI6Imh0dHBzOi8vaWQuY29udHVob2MuY29tL3JlYWxtcy9jdGhzc28iLCJzdWIiOiI0MWRkZjg2OS03YmYzLTRlZjctYjFjOC1mNGJlMDAzNDNjMmQiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoic2Nob29sIiwic2lkIjoiODUwNzE0Y2EtNmYzZS00YjJiLTlhYzItOTgzZTBlNDk3OTM5Iiwic2NvcGUiOiJvcGVuaWQgcm9sZXMgd2ViLW9yaWdpbnMgYWNyIHNlcnZpY2VfYWNjb3VudCBwcm9maWxlIGVtYWlsIGJhc2ljIn0.0pzx1iUHgG_pi1H5DrZ4le56LAvuP84ZOtQVmM2TESyyB-kLTSo9cpdVLe5yfjhzfLYusRDQ7kMePq924f5HFg; _azvocab_id_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5cXJOS0dRYURnSG5CTTZFWUtoRTJBaUZpOWZxYmFJZFBUMnByMUxOZVZBIn0.eyJleHAiOjE3Njc2MzQwNTAsImlhdCI6MTc2NzUxNjU1OSwiYXV0aF90aW1lIjoxNzY3NDYxMjUwLCJqdGkiOiI4OTExY2ZmMy1jZWU3LTQ3NjQtYmYyNi05NGE0MzBiYmQzYjkiLCJpc3MiOiJodHRwczovL2lkLmNvbnR1aG9jLmNvbS9yZWFsbXMvY3Roc3NvIiwiYXVkIjoic2Nob29sIiwic3ViIjoiNDFkZGY4NjktN2JmMy00ZWY3LWIxYzgtZjRiZTAwMzQzYzJkIiwidHlwIjoiSUQiLCJhenAiOiJzY2hvb2wiLCJzaWQiOiI4NTA3MTRjYS02ZjNlLTRiMmItOWFjMi05ODNlMGU0OTc5MzkiLCJhdF9oYXNoIjoia2ROMDV5SGVKLVY1MTlHZVJDZ0g2USIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlbEg24gQW5oIETFqW5nIFBo4bqhbSIsInByZWZlcnJlZF91c2VybmFtZSI6IjE4bWF5dGluaG1vaUBnbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiVsSDbiIsImZhbWlseV9uYW1lIjoiQW5oIETFqW5nIFBo4bqhbSIsImVtYWlsIjoiMThtYXl0aW5obW9pQGdtYWlsLmNvbSJ9.UFuhdNi9bqrF_xTvNlcPGJ51p1jlNn7kRLrRJL0jooYKgWiFKFeyhkhoaKJgFxlzsWVKcuawaY4Gpq6141GSBBcUvZX5y0lg5zWZHJWx9vURfh0Bddjxng8qqXbh9b9br9RoSScQg14vaGG6xxBEJiBfnFgir5312zeKu8V1U2stIziZXQVJbZZH6fA5Z6xlkCLbI6u2bjvngVXIJcvDA8WTmnbaqbq_IoJQN5JEraejOBmdEiCBN2Be4E8jx63bEKORYc2P18t6q402po5vugexMriNc9yPC6V6ypo2cTF0BkvGE26SaHS6U6ErCzSgISTTjDd9P5DXp7SlRCtyoA; _ga_RTRFMR7BXM=GS2.1.s1767534810$o18$g1$t1767534841$j29$l0$h0';

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
  ) {}

  async import(keyword: string): Promise<ImportResult[]> {
    const result = await this.searchAndGetDefinitions(keyword);

    if (result.length === 0) {
      return [];
    }

    const importResults: ImportResult[] = [];

    for (const { vocabData, definitions } of result) {
      let wordCreated = false;
      let createdSenses = 0;
      let createdPronunciations = 0;
      let createdExamples = 0;
      let skippedSenses = 0;

      // Use a transaction
      await this.em.transactional(async (em) => {
        // 1. Find or create Word
        let word = await em.findOne(WordEntity, {
          normalizedText: keyword.toLowerCase(),
          language: Language.EN,
        });

        if (!word) {
          word = new WordEntity(this.adapter.adaptWord(vocabData));
          em.persist(word);
          wordCreated = true;
        } else {
          wrap(word).assign(this.adapter.adaptWord(vocabData));
        }

        // 2. Pronunciations
        const pronunciationDataList = this.adapter.adaptPronunciations(
          vocabData,
          word,
        );
        for (const pronData of pronunciationDataList) {
          const exists = await em.findOne(PronunciationEntity, {
            word: word,
            region: pronData.region,
          });
          if (!exists) {
            em.persist(new PronunciationEntity(pronData));
            createdPronunciations++;
          }
        }

        // 3. Definitions -> WordSenses
        for (const [index, apiDef] of definitions.entries()) {
          const defDetail = apiDef.pageProps.def;
          const existsRef = await em.findOne(WordSenseEntity, {
            externalId: defDetail.id,
          });

          if (!existsRef) {
            const wordSense = new WordSenseEntity(
              this.adapter.adaptSenses(defDetail, word, index),
            );
            em.persist(wordSense);
            createdSenses++;

            // 4. Examples
            const examples = this.adapter.adaptExamples(
              defDetail.samples || [],
              wordSense,
            );
            for (const exData of examples) {
              em.persist(new ExampleEntity(exData));
              createdExamples++;
            }
          } else {
            skippedSenses++;
          }
        }
      });

      const finalWord = await this.em.findOne(WordEntity, {
        normalizedText: keyword.toLowerCase(),
        language: Language.EN,
      });

      importResults.push({
        keyword: vocabData.vocab,
        wordId: finalWord?.id || null,
        wordCreated,
        createdSenses,
        createdPronunciations,
        createdExamples,
        skippedSenses,
        totalDefinitions: definitions.length,
      });
    }

    return importResults;
  }

  /**
   * Search for a word in azVocab dictionary
   */
  private async search(keyword: string): Promise<AzVocabSearchResponseDto[]> {
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

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to search for keyword: ${keyword}`, error);
      throw error;
    }
  }

  /**
   * Get detailed definition for a specific definition ID
   */
  private async getDefinition(
    defId: string,
  ): Promise<AzVocabDefinitionResponseDto | null> {
    try {
      const url = `${this.baseUrl}/_next/data/${this.buildId}/vi/definition/${defId}.json?id=${defId}`;

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

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get definition for ID: ${defId}`, error);
      return null; // Return null mostly to continue processing other definitions
    }
  }

  private async searchAndGetDefinitions(keyword: string): Promise<
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

      // Step 3: Get detailed definitions with batch delay to avoid API spam
      // Collect all definition IDs from matching entries
      const allDefIds = searchResults.flatMap((entry) =>
        entry.defs.map((def) => def.id),
      );

      let requestCount = 0;

      const result: {
        vocabData: VocabDetailDto;
        definitions: AzVocabDefinitionResponseDto[];
      }[] = [];

      for (const entry of searchResults) {
        const defIds = entry.defs.map((def) => def.id);
        const definitions: AzVocabDefinitionResponseDto[] = [];
        for (const defId of defIds) {
          const defData = await this.getDefinition(defId);
          if (defData?.pageProps) {
            definitions.push(defData);
          }

          requestCount++;

          // Delay after every BATCH_SIZE requests
          if (
            requestCount % BATCH_SIZE === 0 &&
            requestCount < allDefIds.length
          ) {
            this.logger.debug(
              `Batch ${requestCount / BATCH_SIZE} completed, delaying ${BATCH_DELAY_MS}ms...`,
            );
            await delay(BATCH_DELAY_MS);
          }
        }

        if (definitions.length === 0 || !definitions[0].pageProps?.vocab) {
          continue;
        }

        result.push({
          vocabData: definitions[0].pageProps.vocab,
          definitions,
        });
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to search and get definitions for keyword: ${keyword}`,
        error,
      );
      throw error;
    }
  }
}
