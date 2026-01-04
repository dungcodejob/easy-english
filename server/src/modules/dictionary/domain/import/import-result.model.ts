export interface ImportResult {
  keyword: string;
  wordId: string | null;
  wordCreated: boolean;
  createdSenses: number;
  createdPronunciations: number;
  createdExamples: number;
  skippedSenses: number;
  totalDefinitions: number;
}
