import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateTopicSenseDto {
  @IsOptional()
  @IsString()
  personalNote?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalExamples?: string[];

  @IsOptional()
  @IsString()
  definitionVi?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customImages?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficultyRating?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
