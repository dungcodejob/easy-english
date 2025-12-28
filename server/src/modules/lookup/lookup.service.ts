import {
  DictionarySource,
  Language,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NormalizedData } from './models/lookup-result.model';
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

    return normalizedData
      .asyncMap(async (wordData) => await this.persistWordData(wordData))
      .match(
        (word) => word,
        (error) => {
          this.logger.error(`Provider ${source} lookup failed: ${error}`);
          return null;
        },
      );
  }

  private async persistWordData(data: NormalizedData): Promise<WordEntity> {
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
