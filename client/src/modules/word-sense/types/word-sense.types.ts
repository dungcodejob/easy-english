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

// Dictionary Lookup Response (matches Word domain model from server)
export interface DictionarySense {
  id: string;
  partOfSpeech: string;
  definition: string;
  definitionVi?: string;
  shortDefinition?: string;
  examples: { id: string; text: string; translationVi?: string; order: number }[];
  synonyms: string[];
  antonyms: string[];
  senseIndex: number;
  source: string;
  externalId?: string;
  cefrLevel?: string;
  images: string[];
  collocations: string[];
  relatedWords: string[];
  idioms: string[];
  phrases: string[];
  verbPhrases: string[];
  updateBy?: string;
}

export interface DictionaryPronunciation {
  id: string;
  ipa?: string;
  audioUrl?: string;
  region?: string;
}

export interface WordInflects {
  NNS?: string[];
  VBD?: string[];
  VBG?: string[];
  VBP?: string[];
  VBZ?: string[];
  JJR?: string[];
  JJS?: string[];
  RBR?: string[];
  RBS?: string[];
}

export interface WordFamily {
  n?: string[];
  v?: string[];
  adj?: string[];
  adv?: string[];
  head: string;
}

export interface WordDto {
  id: string;
  text: string;
  normalizedText: string;
  language: string;
  pronunciations: DictionaryPronunciation[];
  senses: DictionarySense[];
  tags: string[];
  originalWord?: string;
  source: string;
  rank?: number;
  frequency?: number;
  inflects?: WordInflects;
  wordFamily?: WordFamily;
  externalId?: string;
}
