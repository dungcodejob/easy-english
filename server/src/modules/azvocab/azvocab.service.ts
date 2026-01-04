import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { EntityManager } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  mapToExamples,
  mapToPronunciations,
  mapToWordData,
  mapToWordSenseData,
} from './adapters/azvocab-adapter';
import { AzVocabDefinitionResponseDto } from './dto/definition-response.dto';
import {
  ImportDictionaryDto,
  ImportDictionarySummaryDto,
} from './dto/import-vocab.dto';
import { AzVocabSearchResponseDto } from './dto/search-response.dto';

@Injectable()
export class AzVocabService {
  private readonly logger = new Logger(AzVocabService.name);
  private readonly baseUrl = 'https://azvocab.ai';
  private readonly buildId = '_JSpT6LfxA-74vnvYXw9U'; // This might need to be dynamic

  constructor(
    private readonly httpService: HttpService,
    private readonly em: EntityManager,
  ) {}

  /**
   * Search for a word in azVocab dictionary
   * @param keyword - The word to search for
   * @returns Array of vocabulary entries
   */
  async search(keyword: string): Promise<AzVocabSearchResponseDto[]> {
    try {
      const url = `${this.baseUrl}/api/vocab/search?q=${encodeURIComponent(keyword)}`;

      const response = await firstValueFrom(
        this.httpService.post<AzVocabSearchResponseDto[]>(url, null, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
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
   * @param defId - The definition ID (e.g., "crazy.1.1")
   * @returns Detailed definition information
   */
  async getDefinition(defId: string): Promise<AzVocabDefinitionResponseDto> {
    try {
      const url = `${this.baseUrl}/_next/data/${this.buildId}/vi/definition/${defId}.json?id=${defId}`;

      const response = await firstValueFrom(
        this.httpService.get<AzVocabDefinitionResponseDto>(url, {
          headers: {
            Accept: '*/*',
            'x-nextjs-data': '1',
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get definition for ID: ${defId}`, error);
      throw error;
    }
  }

  /**
   * Search for a word and get all detailed definitions
   * Filters entries with ID matching pattern ${keyword}.number (e.g., "crazy.1")
   * @param keyword - The word to search for
   * @returns Array of detailed definitions
   */
  async searchAndGetDefinitions(
    keyword: string,
  ): Promise<AzVocabDefinitionResponseDto[]> {
    try {
      // Step 1: Search for the keyword
      const searchResults = await this.search(keyword);

      // Step 2: Filter entries with ID matching pattern ${keyword}.number
      const pattern = new RegExp(`^${keyword}\\.`);
      const matchingEntries = searchResults.filter((entry) =>
        pattern.test(entry.id),
      );

      this.logger.log(
        `Found ${matchingEntries.length} matching entries for keyword: ${keyword}`,
      );

      // Step 3: Get detailed definitions for each matching entry
      const definitions = await Promise.all(
        matchingEntries.map(async (entry) => {
          // For each entry, we need to get all definition IDs
          // Definition IDs follow pattern: ${entry.id}.number (e.g., "crazy.1.1", "crazy.1.2")
          const defPromises = entry.defs.map((def) =>
            this.getDefinition(def.id),
          );
          return Promise.all(defPromises);
        }),
      );

      // Flatten the array of arrays
      return definitions.flat();
    } catch (error) {
      this.logger.error(
        `Failed to search and get definitions for keyword: ${keyword}`,
        error,
      );
      throw error;
    }
  }

  async importToDictionary(
    dto: ImportDictionaryDto,
  ): Promise<ImportDictionarySummaryDto> {
    const { keyword } = dto;
    const definitions = await this.searchAndGetDefinitions(keyword);

    if (definitions.length === 0) {
      return {
        keyword,
        wordId: null,
        wordCreated: false,
        createdSenses: 0,
        createdPronunciations: 0,
        createdExamples: 0,
        skippedSenses: 0,
        totalDefinitions: 0,
      };
    }

    // Assume all definitions belong to the same vocab
    const vocabData = definitions[0].pageProps.vocab;

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
        language: 'en',
      });

      if (!word) {
        word = new WordEntity(mapToWordData(vocabData));
        em.persist(word);
        wordCreated = true;
      }

      // 2. Pronunciations
      const pronunciationDataList = mapToPronunciations(vocabData, word);
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
            mapToWordSenseData(defDetail, word, index),
          );
          em.persist(wordSense);
          createdSenses++;

          // 4. Examples
          const examples = mapToExamples(defDetail.samples || [], wordSense);
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
      language: 'en',
    });

    return {
      keyword,
      wordId: finalWord?.id || null,
      wordCreated,
      createdSenses,
      createdPronunciations,
      createdExamples,
      skippedSenses,
      totalDefinitions: definitions.length,
    };
  }
}
