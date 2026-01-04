export interface AzVocabDefinitionResponseDto {
  pageProps: {
    _nextI18Next: any;
    collections: CollectionDto[];
    ogInfo: OgInfoDto;
    def: DefDetailDto;
    vocab: VocabDetailDto;
  };
  __N_SSG: boolean;
}

export interface CollectionDto {
  id: string;
  name: string;
  brief: string;
  image: string;
  description: string;
  languages: string[];
  sets: {
    id: string;
    categoryId: string;
    name: string;
    categoryName: string;
  }[];
}

export interface OgInfoDto {
  title: string;
  ogTitle: string;
  type: string;
  image: string;
  description: string;
  image_alt: string;
}

export interface DefDetailDto {
  id: string;
  vi: string;
  def: string;
  sets?: any[];
  level?: string;
  images?: string[];
  samples?: any[];
  antonyms?: string[];
  synonyms?: string[];
  updateBy?: string;
  lastUpdate?: number;
  entryId: string;
  vocab: string;
  pos: string;
  uk?: string;
  us?: string;
  pron_uk?: string;
  pron_us?: string;
  idioms?: string[];
  verb_phrases?: string[];
  phrases?: string[];
  family?: any;
  rank?: number;
  freq?: number;
}

export interface VocabDetailDto {
  uk?: string;
  us?: string;
  dict: string;
  freq?: number;
  rank?: number;
  vocab: string;
  source: string;
  entries: any[];
  pron_uk?: string;
  pron_us?: string;
  inflects?: Record<string, string[]>;
  updateBy?: string;
  lastUpdate?: number;
}

export interface AzVocabSearchResponseDto {
  id: string;
  pos: string;
  defs: DefinitionDto[];
  family?: WordFamilyDto;
  idioms?: string[];
  vocab: string;
  pron_uk?: string;
  pron_us?: string;
  uk?: string;
  us?: string;
  inflects?: Record<string, string[]>;
  rank?: number;
  freq?: number;
}

export interface DefinitionDto {
  id: string;
  vi: string;
  def: string;
  sets?: SetDto[];
  level?: string;
  images?: string[];
  samples?: SampleDto[];
  antonyms?: string[];
  synonyms?: string[];
  updateBy?: string;
  lastUpdate?: number;
  entryId: string;
  vocab: string;
  pos: string;
  uk?: string;
  us?: string;
  pron_uk?: string;
  pron_us?: string;
  idioms?: string[];
  verb_phrases?: string[];
  phrases?: string[];
  family?: WordFamilyDto;
  inflects?: Record<string, string[]>;
  rank?: number;
  freq?: number;
  colloc?: CollocationDto;
}

export interface SetDto {
  id: string;
  categoryId: string;
  collectionId: string;
}

export interface SampleDto {
  id: string;
  text: string;
  sets?: any[];
}

export interface WordFamilyDto {
  n?: string[];
  adj?: string[];
  adv?: string[];
  v?: string[];
  head: string;
}

export interface CollocationDto {
  pre?: {
    v?: string[];
    adv?: string[];
  };
  suf?: {
    prep?: string[];
  };
}
