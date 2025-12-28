export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum LearningStatus {
  New = 'new',
  Learning = 'learning',
  Reviewing = 'reviewing',
  Mastered = 'mastered',
}

export interface UserWordSenseMedia {
  images?: string[];
  videos?: string[];
}

export interface UserWordSense {
  id: string;
  userId: string;
  topicId: string;
  word: string;
  language: string;
  partOfSpeech: string;
  definition: string;
  examples?: string[];
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficultyLevel: DifficultyLevel;
  learningStatus: LearningStatus;
  media?: UserWordSenseMedia;
  lastReviewAt?: Date;
  dictionarySenseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserWordSenseDtoItem {
  topicId: string;
  word: string;
  language: string;
  partOfSpeech: string;
  definition: string;
  examples?: string[];
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficultyLevel?: DifficultyLevel;
  learningStatus?: LearningStatus;
  media?: UserWordSenseMedia;
  dictionarySenseId?: string;
}

export interface CreateUserWordSenseDto {
  senses: CreateUserWordSenseDtoItem[];
}

export interface UpdateUserWordSenseDto {
  definition?: string;
  examples?: string[];
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficultyLevel?: DifficultyLevel;
  learningStatus?: LearningStatus;
  media?: UserWordSenseMedia;
}

// Dictionary Lookup Response
export interface DictionarySense {
  id: string;
  wordId: string;
  partOfSpeech: string;
  definition: string;
  shortDefinition?: string;
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
  senseIndex: number;
}

export interface DictionaryPronunciation {
  ipa?: string;
  audioUrl?: string;
  region?: string;
}

export interface DictionaryLookupResult {
  word: string;
  language: string;
  pronunciations: DictionaryPronunciation[];
  senses: DictionarySense[];
}
