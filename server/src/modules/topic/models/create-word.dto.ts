import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWordDto {
  @IsNotEmpty()
  @IsString()
  word: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsArray()
  definitions?: any[];

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsArray()
  partOfSpeech?: string[];

  @IsOptional()
  @IsArray()
  examples?: string[];

  @IsOptional()
  @IsArray()
  synonyms?: string[];

  @IsOptional()
  @IsArray()
  antonyms?: string[];

  @IsOptional()
  @IsString()
  personalNote?: string;

  @IsOptional()
  mediaUrls?: { images: string[]; audios: string[]; videos: string[] };

  @IsOptional()
  @IsNumber()
  difficulty?: number;

  @IsOptional()
  customFields?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  fromOxfordApi?: boolean;
}
