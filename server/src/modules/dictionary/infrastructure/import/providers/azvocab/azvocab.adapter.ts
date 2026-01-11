import {
  WordEntity,
  WordExampleEntity,
  WordPronunciationEntity,
  WordSenseEntity,
} from '@app/entities';
import { IImportAdapter } from '../../../../domain/import/import-adapter.interface';
import { DefDetailDto, VocabDetailDto } from './azvocab.types';

export class AzVocabAdapter implements IImportAdapter<any> {
  // We handle separate types for Word and Sense/Examples here as per original logic

  adaptWord(vocab: VocabDetailDto): Partial<WordEntity> {
    return {
      text: vocab.vocab,
      normalizedText: vocab.vocab.toLowerCase(),
      language: 'en',
      rank: vocab.rank,
      frequency: vocab.freq,
      source: 'azvocab',
      inflects: vocab.inflects,
      wordFamily:
        typeof vocab.entries?.[0]?.family === 'object'
          ? vocab.entries[0].family
          : undefined,
    };
  }

  adaptSenses(
    def: DefDetailDto,
    word: WordEntity,
    senseIndex: number,
  ): Partial<WordSenseEntity> {
    return {
      word: word,
      partOfSpeech: def.pos,
      definition: def.def,
      definitionVi: def.vi,
      cefrLevel: def.level,
      images: def.images,
      synonyms: def.synonyms,
      antonyms: def.antonyms,
      idioms: def.idioms,
      phrases: def.phrases,
      verbPhrases: def.verb_phrases,
      externalId: def.id,
      source: 'azvocab',
      senseIndex: senseIndex,
    };
  }

  adaptPronunciations(
    vocab: VocabDetailDto,
    word: WordEntity,
  ): Array<Partial<WordPronunciationEntity>> {
    const result: Array<Partial<WordPronunciationEntity>> = [];

    if (vocab.uk || vocab.pron_uk) {
      result.push({
        word: word,
        ipa: vocab.pron_uk,
        audioUrl: vocab.uk,
        region: 'uk',
      });
    }

    if (vocab.us || vocab.pron_us) {
      result.push({
        word: word,
        ipa: vocab.pron_us,
        audioUrl: vocab.us,
        region: 'us',
      });
    }

    return result;
  }

  adaptExamples(
    samples: any[],
    wordSense: WordSenseEntity,
  ): Array<Partial<WordExampleEntity>> {
    if (!samples || !Array.isArray(samples)) return [];

    return samples.map((sample, index) => {
      const text =
        typeof sample === 'string'
          ? sample
          : sample.text || JSON.stringify(sample);

      return {
        sense: wordSense,
        text: text,
        order: index,
      };
    });
  }
}
