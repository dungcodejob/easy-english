import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '@app/decorators';
import {
  DifficultyLevel,
  LearningStatus,
  UserWordSenseMedia,
} from '@app/entities';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UserWordSenseMediaDto implements UserWordSenseMedia {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];
}

export class UserWordSenseItemDto {
  @StringField()
  partOfSpeech: string;

  @StringField()
  definition: string;

  @StringFieldOptional({
    each: true,
  })
  examples?: string[];

  @StringFieldOptional()
  pronunciation?: string;

  @StringFieldOptional({
    each: true,
  })
  synonyms?: string[];

  @StringFieldOptional({
    each: true,
  })
  antonyms?: string[];

  @EnumFieldOptional(() => DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @EnumFieldOptional(() => LearningStatus)
  learningStatus?: LearningStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserWordSenseMediaDto)
  media?: UserWordSenseMediaDto;

  @IsOptional()
  @IsUUID()
  dictionarySenseId?: string;

  @StringFieldOptional()
  notes?: string;
}

export class CreateUserWordSenseDto {
  @IsNotEmpty()
  @IsUUID()
  topicId: string;

  @IsNotEmpty()
  @IsString()
  workspaceId: string;

  @IsNotEmpty()
  @IsString()
  word: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWordSenseItemDto)
  senses: UserWordSenseItemDto[];
}
