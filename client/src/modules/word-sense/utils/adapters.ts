import type { SenseEditorFormValues } from '../components/sense-editor';
import {
    type CreateUserWordSenseDtoItem,
    type UpdateUserWordSenseDto,
    type UserWordSense
} from '../types/word-sense.types';

/**
 * Adapts a UserWordSense entity to SenseEditorFormValues
 */
export const userWordSenseToFormValues = (
  wordSense: UserWordSense
): SenseEditorFormValues => {
  return {
    partOfSpeech: wordSense.partOfSpeech,
    definition: wordSense.definition,
    pronunciation: wordSense.pronunciation,
    examples: wordSense.examples?.map((ex) => ({ value: ex })) || [],
    synonyms: wordSense.synonyms?.map((syn) => ({ value: syn })) || [],
    antonyms: wordSense.antonyms?.map((ant) => ({ value: ant })) || [],
    difficultyLevel: wordSense.difficultyLevel,
    learningStatus: wordSense.learningStatus,
    mediaImages: wordSense.media?.images?.map((img) => ({ value: img })) || [],
    mediaVideos: wordSense.media?.videos?.map((vid) => ({ value: vid })) || [],
  };
};

/**
 * Context required to create a full CreateUserWordSenseDtoItem from form values
 */
interface CreateDtoContext {
  topicId: string;
  word: string;
  language: string;
  dictionarySenseId?: string;
}

/**
 * Adapts SenseEditorFormValues to CreateUserWordSenseDtoItem
 */
export const formValuesToCreateDtoItem = (
  form: SenseEditorFormValues,
  context: CreateDtoContext
): CreateUserWordSenseDtoItem => {
  return {
    topicId: context.topicId,
    word: context.word,
    language: context.language,
    partOfSpeech: form.partOfSpeech,
    definition: form.definition,
    pronunciation: form.pronunciation || undefined,
    examples: form.examples?.map((e) => e.value).filter(Boolean) || undefined,
    synonyms: form.synonyms?.map((s) => s.value).filter(Boolean) || undefined,
    antonyms: form.antonyms?.map((a) => a.value).filter(Boolean) || undefined,
    difficultyLevel: form.difficultyLevel,
    learningStatus: form.learningStatus,
    media: {
      images: form.mediaImages?.map((i) => i.value).filter(Boolean) || undefined,
      videos: form.mediaVideos?.map((v) => v.value).filter(Boolean) || undefined,
    },
    dictionarySenseId: context.dictionarySenseId,
  };
};

/**
 * Adapts SenseEditorFormValues to UpdateUserWordSenseDto
 */
export const formValuesToUpdateDto = (
  form: SenseEditorFormValues
): UpdateUserWordSenseDto => {
  return {
    definition: form.definition,
    pronunciation: form.pronunciation || undefined,
    examples: form.examples?.map((e) => e.value).filter(Boolean) || undefined,
    synonyms: form.synonyms?.map((s) => s.value).filter(Boolean) || undefined,
    antonyms: form.antonyms?.map((a) => a.value).filter(Boolean) || undefined,
    difficultyLevel: form.difficultyLevel,
    learningStatus: form.learningStatus,
    media: {
      images: form.mediaImages?.map((i) => i.value).filter(Boolean) || undefined,
      videos: form.mediaVideos?.map((v) => v.value).filter(Boolean) || undefined,
    },
  };
};
