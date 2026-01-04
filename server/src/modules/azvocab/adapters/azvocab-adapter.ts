import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { DefDetailDto, VocabDetailDto } from '../dto/definition-response.dto';

export function mapToWordData(vocab: VocabDetailDto): Partial<WordEntity> {
  return {
    text: vocab.vocab,
    normalizedText: vocab.vocab.toLowerCase(),
    language: 'en',
    rank: vocab.rank,
    frequency: vocab.freq,
    source: 'azvocab',
    inflects: vocab.inflects,
    // family might need processing if it's not directly compatible, but let's assume it matches strictly typed structure or we handle it loosely
    wordFamily:
      typeof vocab.entries?.[0]?.family === 'object'
        ? vocab.entries[0].family
        : undefined,
  };
}

const AzvocabPartOfSpeech = {
  n: 'noun',
  v: 'verb',
  a: 'adjective',
  adv: 'adverb',
};

export function mapToWordSenseData(
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

export function mapToPronunciations(
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

export function mapToExamples(
  samples: any[],
  wordSense: WordSenseEntity,
): Array<Partial<ExampleEntity>> {
  if (!samples || !Array.isArray(samples)) return [];

  return samples.map((sample, index) => {
    // azVocab samples can be just string or object { text: string, ... }
    const text =
      typeof sample === 'string'
        ? sample
        : sample.text || JSON.stringify(sample);

    return {
      sense: wordSense,
      text: text,
      order: index,
      // azVocab usually doesn't provide translation for examples implementation-wise here
    };
  });
}
