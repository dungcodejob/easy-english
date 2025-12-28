import {
  DateFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '@app/decorators';
import { DifficultyLevel, LearningStatus } from '@app/entities';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserWordSenseMediaDto } from './create-user-word-sense.dto';

export class UpdateUserWordSenseDto {
  @StringFieldOptional()
  definition?: string;

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

  @DateFieldOptional()
  lastReviewAt?: Date;

  @StringFieldOptional()
  note?: string;
}
