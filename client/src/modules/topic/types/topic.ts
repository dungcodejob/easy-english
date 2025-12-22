import type { TopicCategory } from "./topic.types";

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