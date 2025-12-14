export interface Word {
  id: string;
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
  difficulty: number;
  customFields?: Record<string, any>;
  fromOxfordApi: boolean;
  oxfordData?: any;
  reviewCount: number;
  lastReviewedAt?: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}


