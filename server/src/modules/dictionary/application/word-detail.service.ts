import type { IWordAggregateRepository } from '@app/domain/dictionary';
import { WORD_AGGREGATE_REPOSITORY, Word } from '@app/domain/dictionary';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WordDetailResponseDto } from '../presentation/dto/word-detail-response.dto';

@Injectable()
export class WordDetailService {
  constructor(
    @Inject(WORD_AGGREGATE_REPOSITORY)
    private readonly wordRepo: IWordAggregateRepository,
  ) {}

  async getWordDetail(keyword: string): Promise<WordDetailResponseDto> {
    const normalizedText = keyword.toLowerCase().trim();

    const word = await this.wordRepo.findByNormalizedText(normalizedText, 'en');

    if (!word) {
      throw new NotFoundException(`Word not found: ${keyword}`);
    }

    return this.mapToDto(word);
  }

  private mapToDto(word: Word): WordDetailResponseDto {
    return {
      id: word.id,
      text: word.text,
      rank: word.rank,
      frequency: word.frequency,
      wordFamily: word.wordFamily as any,
      pronunciations: word.pronunciations.map((p) => ({
        region: p.region as 'uk' | 'us',
        ipa: p.ipa,
        audioUrl: p.audioUrl,
      })),
      senses: word.senses.map((sense) => ({
        id: sense.id,
        partOfSpeech: String(sense.partOfSpeech),
        definition: sense.definition,
        definitionVi: sense.definitionVi,
        cefrLevel: sense.cefrLevel,
        images: sense.images,
        synonyms: sense.synonyms,
        antonyms: sense.antonyms,
        idioms: sense.idioms,
        phrases: sense.phrases,
        verbPhrases: sense.verbPhrases,
        examples: sense.examples.map((ex) => ({
          text: ex.text,
          translationVi: ex.translationVi,
        })),
      })),
    };
  }
}
