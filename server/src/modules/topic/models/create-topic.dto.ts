import { TopicCategory } from '@app/entities';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TopicCategory)
  category: TopicCategory = TopicCategory.Vocabulary;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[] = [];

  @IsString()
  @IsNotEmpty()
  languagePair: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean = false;
}
