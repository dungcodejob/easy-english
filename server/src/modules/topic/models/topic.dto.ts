import { TopicCategory } from '@app/entities';

export class TopicDto {
  id: string;
  name: string;
  description?: string;
  category: TopicCategory;
  tags: string[];
  languagePair: string;
  coverImageUrl?: string;
  isPublic: boolean;
  wordCount: number;
  shareUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
