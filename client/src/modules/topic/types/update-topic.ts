import type { TopicCategory } from "./topic.types";

export interface UpdateTopicDto {
  name?: string;
  description?: string;
  category?: TopicCategory;
  tags?: string[];
  languagePair?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}