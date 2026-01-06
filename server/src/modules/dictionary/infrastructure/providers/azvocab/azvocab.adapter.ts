import { DictionarySource, Language } from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Word } from '../../../domain/models/word';
import {
  AzVocabDefinitionResponseDto,
  DefDetailDto,
  VocabDetailDto,
} from './azvocab.types';

/**
 * AzVocab Adapter
 * Converts AzVocab API responses to domain models
 */
@Injectable()
export class AzVocabAdapter {
  private readonly logger = new Logger(AzVocabAdapter.name);

  /**
   * Convert to Word domain model for Lookup flow
   */
  toWordDomain(
    vocabData: VocabDetailDto,
    definitions: AzVocabDefinitionResponseDto[],
  ): Word | null {
    if (!vocabData || !definitions || definitions.length === 0) {
      this.logger.warn('Invalid AzVocab data for normalization');
      return null;
    }

    try {
      const wordText = vocabData.vocab;

      if (!wordText) {
        throw new Error('Word text missing in AzVocab data');
      }

      // Create Word aggregate
      const word = new Word({
        text: wordText,
        normalizedText: wordText.toLowerCase().trim(),
        language: Language.EN,
        source: DictionarySource.AZVOCAB,
      });

      // Add Pronunciations
      if (vocabData.pron_uk || vocabData.uk) {
        word.addPronunciation({
          ipa: vocabData.pron_uk,
          audioUrl: vocabData.uk,
          region: 'UK',
        });
      }

      if (vocabData.pron_us || vocabData.us) {
        word.addPronunciation({
          ipa: vocabData.pron_us,
          audioUrl: vocabData.us,
          region: 'US',
        });
      }

      // Add Senses
      definitions.forEach((defResponse, index) => {
        const def = defResponse.pageProps?.def;
        if (!def) return;

        const sense = word.addSense({
          partOfSpeech: def.pos || 'unknown',
          definition: def.def,
          senseIndex: index,
          source: DictionarySource.AZVOCAB,
          shortDefinition: def.def.substring(0, 100),
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || [],
          externalId: def.id,
        });

        // Add examples
        for (const sample of def.samples || []) {
          sense.addExample({ text: sample.text });
        }
      });

      return word;
    } catch (error) {
      this.logger.error(
        `AzVocab adaptation failed: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Adapt word for entity creation (Import flow)
   */
  adaptWord(vocabData: VocabDetailDto) {
    return {
      text: vocabData.vocab,
      normalizedText: vocabData.vocab.toLowerCase().trim(),
      language: Language.EN,
      source: DictionarySource.AZVOCAB,
    };
  }

  /**
   * Adapt pronunciations for entity creation (Import flow)
   */
  adaptPronunciations(vocabData: VocabDetailDto, word: any) {
    const pronunciations: any[] = [];

    if (vocabData.pron_uk || vocabData.uk) {
      pronunciations.push({
        word,
        ipa: vocabData.pron_uk,
        audioUrl: vocabData.uk,
        region: 'UK',
      });
    }

    if (vocabData.pron_us || vocabData.us) {
      pronunciations.push({
        word,
        ipa: vocabData.pron_us,
        audioUrl: vocabData.us,
        region: 'US',
      });
    }

    return pronunciations;
  }

  /**
   * Adapt sense for entity creation (Import flow)
   */
  adaptSenses(def: DefDetailDto, word: any, index: number) {
    return {
      word,
      externalId: def.id,
      partOfSpeech: def.pos || 'unknown',
      definition: def.def,
      definitionVi: def.vi,
      senseIndex: index,
      source: DictionarySource.AZVOCAB,
      synonyms: def.synonyms || [],
      antonyms: def.antonyms || [],
      idioms: def.idioms || [],
      phrases: def.phrases || [],
      verbPhrases: def.verb_phrases || [],
    };
  }

  /**
   * Adapt examples for entity creation (Import flow)
   */
  adaptExamples(samples: any[], wordSense: any) {
    return samples.map((sample) => ({
      wordSense,
      text: sample.text,
      externalId: sample.id,
    }));
  }
}
