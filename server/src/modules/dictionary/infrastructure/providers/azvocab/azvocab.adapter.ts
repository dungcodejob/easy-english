import {
  DictionarySource,
  Language,
  WordSensePartOfSpeech,
} from '@app/entities';
import { Injectable, Logger } from '@nestjs/common';
import { Word } from '../../../domain/models/word';
import { AzVocabDefinitionResponseDto, VocabDetailDto } from './azvocab.types';

export enum AzVocabPartOfSpeech {
  noun = 'n',
  verb = 'v',
  adjective = 'a',
  adverb = 'adv',
  pronoun = 'pron',
  preposition = 'prep',
  conjunction = 'conj',
  interjection = 'intj',
  phrase = 'phr',
  idiom = 'idiom',
  phraseVerb = 'phr.v',
}

const azVocabMappingPosToPartOfSpeech: Record<
  AzVocabPartOfSpeech,
  WordSensePartOfSpeech
> = {
  [AzVocabPartOfSpeech.phraseVerb]: WordSensePartOfSpeech.verb,
  [AzVocabPartOfSpeech.phrase]: WordSensePartOfSpeech.phrase,
  [AzVocabPartOfSpeech.idiom]: WordSensePartOfSpeech.idiom,
  [AzVocabPartOfSpeech.noun]: WordSensePartOfSpeech.noun,
  [AzVocabPartOfSpeech.verb]: WordSensePartOfSpeech.verb,
  [AzVocabPartOfSpeech.adjective]: WordSensePartOfSpeech.adjective,
  [AzVocabPartOfSpeech.adverb]: WordSensePartOfSpeech.adverb,
  [AzVocabPartOfSpeech.pronoun]: WordSensePartOfSpeech.pronoun,
  [AzVocabPartOfSpeech.preposition]: WordSensePartOfSpeech.preposition,
  [AzVocabPartOfSpeech.conjunction]: WordSensePartOfSpeech.conjunction,
  [AzVocabPartOfSpeech.interjection]: WordSensePartOfSpeech.interjection,
};

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
      // Create Word aggregate
      const word = Word.createExternal({
        externalId: vocabData.id,
        text: wordText,
        rank: vocabData.rank,
        inflects: vocabData.inflects,
        wordFamily: vocabData.family,
        frequency: vocabData.freq,
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
          partOfSpeech:
            azVocabMappingPosToPartOfSpeech[def.pos] || def.pos || 'unknown',
          definition: def.def,
          definitionVi: def.vi,
          senseIndex: index,
          cefrLevel: def.level,
          images: def.images,
          idioms: def.idioms,
          phrases: def.phrases,
          verbPhrases: def.verb_phrases,
          source: DictionarySource.AZVOCAB,
          shortDefinition: def.def.substring(0, 100),
          synonyms: def.synonyms || [],
          antonyms: def.antonyms || [],
          externalId: def.id,
        });

        // Add examples
        for (const sample of def.samples || []) {
          sense.addExample({ text: sample.text, externalId: sample.id });
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
}
