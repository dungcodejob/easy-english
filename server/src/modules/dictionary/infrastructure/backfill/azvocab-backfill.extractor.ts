import { WordFamily, WordInflects } from '@app/domain/dictionary';
import { ApiProvider } from '@app/entities';
import { Injectable } from '@nestjs/common';
import {
  AzVocabDefinitionResponseDto,
  WordFamilyDto,
} from '../providers/azvocab/azvocab.types';
import { WordBackfillExtractor } from './word-backfill-extractor.interface';

@Injectable()
export class AzVocabBackfillExtractor implements WordBackfillExtractor {
  readonly provider = ApiProvider.AZVOCAB;

  extractWordFamily(rawResponse: unknown): WordFamily | null {
    const data = rawResponse as AzVocabDefinitionResponseDto;

    // Check pageProps.vocab.family first (VocabDetailDto has family)
    const vocabFamily = data.pageProps?.vocab?.family;
    if (vocabFamily) {
      return this.mapFamily(vocabFamily);
    }

    // Also check pageProps.def.family (DefDetailDto also has family)
    const defFamily = data.pageProps?.def?.family;
    if (defFamily) {
      return this.mapFamily(defFamily);
    }

    return null;
  }

  extractInflects(rawResponse: unknown): WordInflects | null {
    const data = rawResponse as AzVocabDefinitionResponseDto;
    const inflects = data.pageProps?.vocab?.inflects;

    if (inflects) {
      // Map generic Record<string, string[]> to WordInflects specific shape if needed
      // For now, assuming direct compatibility or partial overlap
      return inflects as WordInflects;
    }

    return null;
  }

  extractRank(rawResponse: unknown): number | null {
    const data = rawResponse as AzVocabDefinitionResponseDto;
    return data.pageProps?.vocab?.rank ?? null;
  }

  extractFrequency(rawResponse: unknown): number | null {
    const data = rawResponse as AzVocabDefinitionResponseDto;
    return data.pageProps?.vocab?.freq ?? null;
  }

  private mapFamily(dto: WordFamilyDto): WordFamily {
    return {
      ...dto,
    };
  }
}
