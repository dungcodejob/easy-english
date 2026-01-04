import { IsString } from 'class-validator';

export class ImportDictionaryDto {
  @IsString()
  keyword: string;
}

export class ImportDictionarySummaryDto {
  keyword: string;
  wordId: string | null;
  wordCreated: boolean;
  createdSenses: number;
  createdPronunciations: number;
  createdExamples: number;
  skippedSenses: number;
  totalDefinitions: number;
}
