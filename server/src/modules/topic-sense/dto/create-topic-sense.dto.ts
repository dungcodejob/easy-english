import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTopicSenseDto {
  @IsUUID('4')
  wordSenseId: string;

  @IsOptional()
  @IsString()
  personalNote?: string;

  @IsOptional()
  @IsString()
  definitionVi?: string;
}
