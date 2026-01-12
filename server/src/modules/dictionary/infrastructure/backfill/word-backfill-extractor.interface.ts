import { WordFamily, WordInflects } from '@app/domain/dictionary';
import { ApiProvider } from '@app/entities';

export interface WordBackfillExtractor {
  readonly provider: ApiProvider;

  extractWordFamily(rawResponse: unknown): WordFamily | null;
  extractInflects(rawResponse: unknown): WordInflects | null;
  extractRank(rawResponse: unknown): number | null;
  extractFrequency(rawResponse: unknown): number | null;
}
