import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';

@Injectable()
export class OxfordDictionaryService {
  private readonly logger = new Logger(OxfordDictionaryService.name);
  private readonly baseUrl = 'https://od-api.oxforddictionaries.com/api/v2';
  private readonly appId: string;
  private readonly appKey: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(UNIT_OF_WORK) private readonly _unitOfWork: UnitOfWork,
  ) {
    this.appId = this.configService.get<string>('OXFORD_APP_ID') || '';
    this.appKey = this.configService.get<string>('OXFORD_API_KEY') || '';
  }

  // async lookupWord(word: string, language: string = 'en-gb') {
  //   if (!this.appId || !this.appKey) {
  //     throw new ServiceUnavailableException(
  //       'Oxford API credentials not configured',
  //     );
  //   }

  //   const cacheKey = `oxford:${language}:${word.toLowerCase()}`;
  //   const cachedData = await this.cacheManager.get(cacheKey);
  //   if (cachedData) {
  //     return cachedData;
  //   }

  //   try {
  //     const response = await axios.get(
  //       `${this.baseUrl}/entries/${language}/${word.toLowerCase()}`,
  //       {
  //         headers: {
  //           app_id: this.appId,
  //           app_key: this.appKey,
  //         },
  //       },
  //     );

  //     const data = response.data;
  //     // Cache for 24 hours (86400 seconds) in memory
  //     await this.cacheManager.set(cacheKey, data, 86400000);

  //     // Save to DB cache asynchronously
  //     void this.saveToCache(word, data);

  //     return data;
  //   } catch (error) {
  //     this.logger.error(`Oxford API error for word ${word}: ${error.message}`);
  //     if (axios.isAxiosError(error) && error.response?.status === 404) {
  //       return null; // Word not found
  //     }
  //     if (axios.isAxiosError(error) && error.response?.status === 429) {
  //       throw new BadRequestException('Oxford API rate limit exceeded');
  //     }
  //     throw new BadRequestException(
  //       'Failed to fetch word from Oxford Dictionary',
  //     );
  //   }
  // }

  // async saveToCache(word: string, rawData: any): Promise<void> {
  //   try {
  //     const parsed = this.parseOxfordData(rawData);
  //     if (!parsed) return;

  //     const existing = await this._unitOfWork.wordCache.findOne({
  //       word: word.toLowerCase(),
  //       source: 'oxford',
  //     });

  //     if (existing) {
  //       this._unitOfWork.wordCache.assign(existing, {
  //         raw: rawData,
  //         definition: parsed.definition,
  //         pronunciation: parsed.pronunciation,
  //         audioUrl: parsed.audioUrl,
  //         examples: parsed.examples,
  //         synonyms: parsed.synonyms,
  //         partOfSpeech: parsed.partOfSpeech,
  //         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //       });
  //     } else {
  //       const cacheEntry = new WordCacheEntity({
  //         word: word.toLowerCase(),
  //         source: 'oxford',
  //         raw: rawData,
  //         definition: parsed.definition,
  //         pronunciation: parsed.pronunciation,
  //         audioUrl: parsed.audioUrl,
  //         examples: parsed.examples,
  //         synonyms: parsed.synonyms,
  //         partOfSpeech: parsed.partOfSpeech,
  //         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //       });
  //       this._unitOfWork.wordCache.create(cacheEntry);
  //     }

  //     await this._unitOfWork.save();
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to save word ${word} to DB cache: ${error.message}`,
  //     );
  //   }
  // }

  // // Parse Oxford response to simple structure
  // parseOxfordData(data: any): any {
  //   if (!data || !data.results || !data.results.length) return null;

  //   const entry = data.results[0];
  //   const lexicalEntry = entry.lexicalEntries?.[0]; // Taking first lexical entry for simplicity, though there might be more (noun, verb)

  //   if (!lexicalEntry) return null;

  //   const entryData = lexicalEntry.entries?.[0];
  //   const sense = entryData?.senses?.[0];

  //   const definition = sense?.definitions?.[0];
  //   const examples = sense?.examples?.map((ex: any) => ex.text) || [];
  //   const pronunciation =
  //     lexicalEntry.entries?.[0]?.pronunciations?.[0]?.phoneticSpelling;
  //   const audioUrl = lexicalEntry.entries?.[0]?.pronunciations?.[0]?.audioFile;
  //   const synonyms = sense?.synonyms?.map((syn: any) => syn.text) || [];

  //   return {
  //     definition,
  //     examples,
  //     pronunciation: pronunciation ? `/${pronunciation}/` : undefined,
  //     audioUrl,
  //     synonyms,
  //     partOfSpeech: [lexicalEntry.lexicalCategory.text],
  //   };
  // }
}
