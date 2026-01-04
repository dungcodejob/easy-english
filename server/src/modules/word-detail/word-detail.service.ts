import { WordEntity } from '@app/entities';
import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WordDetailResponseDto } from './dto/word-detail-response.dto';

@Injectable()
export class WordDetailService {
  private readonly logger = new Logger(WordDetailService.name);

  constructor(private readonly em: EntityManager) {}

  async getWordDetail(keyword: string): Promise<WordDetailResponseDto> {
    const word = await this.em.findOne(
      WordEntity,
      {
        normalizedText: keyword.toLowerCase(),
        language: 'en',
      },
      {
        populate: ['pronunciations', 'senses', 'senses.exampleEntities'],
        orderBy: { senses: { senseIndex: 'ASC' } },
      },
    );

    if (!word) {
      throw new NotFoundException(`Word not found: ${keyword}`);
    }

    return {
      id: word.id,
      text: word.text,
      rank: word.rank,
      frequency: word.frequency,
      wordFamily: word.wordFamily as any, // Cast to any or defined type if exists
      pronunciations: word.pronunciations.getItems().map((p) => ({
        region: p.region as 'uk' | 'us',
        ipa: p.ipa,
        audioUrl: p.audioUrl,
      })),
      senses: word.senses.getItems().map((sense) => ({
        id: sense.id,
        partOfSpeech: sense.partOfSpeech,
        definition: sense.definition,
        definitionVi: sense.definitionVi,
        cefrLevel: sense.cefrLevel,
        images: sense.images,
        synonyms: sense.synonyms,
        antonyms: sense.antonyms,
        idioms: sense.idioms,
        phrases: sense.phrases,
        verbPhrases: sense.verbPhrases,
        examples: sense.exampleEntities.getItems().map((ex) => ({
          text: ex.text,
          translationVi: ex.translationVi,
        })),
      })),
    };
  }
}
