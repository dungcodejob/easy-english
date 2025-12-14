export enum TopicCategory {
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  IDIOMS = 'IDIOMS',
  PHRASES = 'PHRASES',
  PRONUNCIATION = 'PRONUNCIATION',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  READING = 'READING',
  WRITING = 'WRITING',
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  category: TopicCategory;
  tags: string[];
  languagePair: string;
  coverImageUrl?: string;
  isPublic: boolean;
  shareUrl?: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
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
