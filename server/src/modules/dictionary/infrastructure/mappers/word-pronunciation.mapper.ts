import type { CreatePronunciationData } from '@app/domain/dictionary/models/word';
import { WordPronunciation } from '@app/domain/dictionary/models/word-pronunciation';
import { WordEntity, WordPronunciationEntity } from '@app/entities';

export class WordPronunciationMapper {
  /**
   * Convert MikroORM WordPronunciationEntity to domain CreatePronunciationData
   */
  static toDomain(entity: WordPronunciationEntity): CreatePronunciationData {
    return {
      id: entity.id,
      ipa: entity.ipa,
      audioUrl: entity.audioUrl,
      region: entity.region,
    };
  }

  /**
   * Convert domain WordPronunciation to MikroORM WordPronunciationEntity
   */
  static toEntity(
    domain: WordPronunciation,
    wordEntity: WordEntity,
  ): WordPronunciationEntity {
    const entity = new WordPronunciationEntity({
      id: domain.id,
      word: wordEntity,
      ipa: domain.ipa,
      audioUrl: domain.audioUrl,
      region: domain.region,
    });

    return entity;
  }

  /**
   * Update MikroORM WordPronunciationEntity from domain WordPronunciation
   */
  static updateEntity(
    domain: WordPronunciation,
    entity: WordPronunciationEntity,
  ): void {
    entity.ipa = domain.ipa;
    entity.audioUrl = domain.audioUrl;
    entity.region = domain.region;
  }
}
