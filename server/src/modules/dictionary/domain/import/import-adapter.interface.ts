import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';

export interface IImportAdapter<TRaw> {
  adaptWord(raw: TRaw): Partial<WordEntity>;
  adaptSenses(
    raw: TRaw,
    word: WordEntity,
    index: number,
  ): Partial<WordSenseEntity>;
  adaptPronunciations(
    raw: TRaw,
    word: WordEntity,
  ): Array<Partial<PronunciationEntity>>;
  adaptExamples(
    raw: TRaw,
    wordSense: WordSenseEntity,
  ): Array<Partial<ExampleEntity>>;
}
