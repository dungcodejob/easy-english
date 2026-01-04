export interface PronunciationDto {
  region: string;
  ipa?: string;
  audioUrl?: string;
}

export interface ExampleDto {
  text: string;
  translationVi?: string;
}

export interface SenseDetailDto {
  id: string;
  partOfSpeech: string;
  definition: string;
  definitionVi?: string;
  cefrLevel?: string;
  images?: string[];
  examples: ExampleDto[];
  synonyms?: string[];
  antonyms?: string[];
  idioms?: string[];
  phrases?: string[];
  verbPhrases?: string[];
}

export interface WordFamilyDto {
  n?: string[];
  v?: string[];
  adj?: string[];
  adv?: string[];
  head: string;
}

export interface WordDetailResponseDto {
  id: string;
  text: string;
  rank?: number;
  frequency?: number;
  wordFamily?: WordFamilyDto;
  pronunciations: PronunciationDto[];
  senses: SenseDetailDto[];
}
