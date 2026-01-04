import { DictionarySource } from '@app/entities';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ImportDto {
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @IsEnum(DictionarySource)
  @IsOptional()
  source: DictionarySource;
}
