import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
  WordSensePartOfSpeech,
} from '@app/entities';
import { IImportAdapter } from '../../../../domain/import/import-adapter.interface';
import { DefDetailDto, VocabDetailDto } from './azvocab.types';

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
      partOfSpeech: azVocabMappingPosToPartOfSpeech[def.pos] || def.pos,
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
  ): Array<Partial<PronunciationEntity>> {
    const result: Array<Partial<PronunciationEntity>> = [];

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
  ): Array<Partial<ExampleEntity>> {
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
