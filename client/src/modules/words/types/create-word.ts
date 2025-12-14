
export interface CreateWordDto {
  word: string;
  definition?: string;
  definitions?: any[];
  pronunciation?: string;
  audioUrl?: string;
  partOfSpeech?: string[];
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  personalNote?: string;
  mediaUrls?: { images: string[]; audios: string[]; videos: string[] };
  difficulty?: number;
  customFields?: Record<string, any>;
  fromOxfordApi?: boolean;
}