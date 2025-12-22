import type { ObjectValues } from "@/shared/utils";
import type { Topic } from "./topic";


export const topicCategory = {
  Vocabulary: 'Vocabulary',
  Grammar: 'Grammar',
  Idioms: 'Idioms',
  Phrases: 'Phrases',
  Pronunciation: 'Pronunciation',
  Listening: 'Listening',
  Speaking: 'Speaking',
  Reading: 'Reading',
  Writing: 'Writing',
} as const



export type TopicCategory = ObjectValues<typeof topicCategory>

export const language = {
  EN: 'EN',
  VI: 'VI',
  FR: 'FR',
  ES: 'ES',
  DE: 'DE',
  JA: 'JA',
  KO: 'KO',
  ZH: 'ZH',
} as const

export type Language = ObjectValues<typeof language>

export const languageLabels: Record<Language, string> = {
  EN: 'English',
  VI: 'Vietnamese',
  FR: 'French',
  ES: 'Spanish',
  DE: 'German',
  JA: 'Japanese',
  KO: 'Korean',
  ZH: 'Chinese',
}








export interface TopicFilters {
  category?: TopicCategory;
  tags?: string[];
  search?: string;
  isPublic?: boolean;
}

export interface TopicListResponse {
  data: Topic[];
  total: number;
  page: number;
  limit: number;
}
