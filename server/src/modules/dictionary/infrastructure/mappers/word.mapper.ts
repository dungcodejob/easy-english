import type { WordFamily, WordInflects } from '@app/domain/dictionary';
import { Word } from '@app/domain/dictionary';
import { EntityManager } from '@mikro-orm/postgresql';
import { CollectionSyncConfig, syncCollection } from './collection-syncer';
// Import Domain Interfaces
import type {
  CreatePronunciationData,
  CreateWordData,
} from '@app/domain/dictionary/models/word';

import { WordExample } from '@app/domain/dictionary/models/word-example';
import { WordPronunciation } from '@app/domain/dictionary/models/word-pronunciation';
import type {
  CreateSenseData,
  WordSense,
} from '@app/domain/dictionary/models/word-sense';
import {
  WordEntity,
  WordExampleEntity,
  WordPronunciationEntity,
  WordSenseEntity,
} from '@app/entities';
import { WordExampleMapper } from './word-example.mapper';
import { WordPronunciationMapper } from './word-pronunciation.mapper';
import { WordSenseMapper } from './word-sense.mapper';

/**
 * WordMapper
 *
 * Maps between domain models and MikroORM entities.
 * This ensures the domain layer remains free of persistence concerns.
 */
export class WordMapper {
  // ==================== DOMAIN ↔ ENTITY MAPPING ====================

  /**
   * Convert MikroORM WordEntity to domain Word aggregate
   */
  static toDomain(entity: WordEntity): Word {
    const pronunciations: CreatePronunciationData[] =
      entity.pronunciations?.isInitialized()
        ? entity.pronunciations
            .getItems()
            .map((p) => WordPronunciationMapper.toDomain(p))
        : [];

    const senses: CreateSenseData[] = entity.senses?.isInitialized()
      ? entity.senses.getItems().map((s) => WordSenseMapper.toDomain(s))
      : [];

    const wordData: CreateWordData = {
      text: entity.text,
      normalizedText: entity.normalizedText,
      language: entity.language,
      rank: entity.rank,
      frequency: entity.frequency,
      source: entity.source,
      inflects: entity.inflects as WordInflects,
      wordFamily: entity.wordFamily as WordFamily,
      updateBy: entity.updateBy,
      pronunciations: pronunciations,
      senses: senses,
    };

    return new Word(wordData, entity.id);
  }

  /**
   * Convert domain Word to MikroORM WordEntity
   */
  static toEntity(domain: Word, existingEntity?: WordEntity): WordEntity {
    const wordEntity =
      existingEntity ??
      new WordEntity({
        text: domain.text,
        normalizedText: domain.normalizedText,
        language: domain.language,
      });

    // Update fields
    wordEntity.rank = domain.rank;
    wordEntity.frequency = domain.frequency;
    wordEntity.source = domain.source;
    wordEntity.inflects = domain.inflects;
    wordEntity.wordFamily = domain.wordFamily;
    wordEntity.updateBy = domain.updateBy;

    // If new entity, set the id from domain
    if (!existingEntity) {
      wordEntity.id = domain.id;
    }

    return wordEntity;
  }

  // ==================== COLLECTION SYNC ====================

  /**
   * Sync all child entities (pronunciations, senses, examples)
   */
  static async syncChildren(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    await this.syncPronunciations(domain, wordEntity, em);
    await this.syncSenses(domain, wordEntity, em);
  }

  private static async syncPronunciations(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    await wordEntity.pronunciations.init();

    const config: CollectionSyncConfig<
      WordPronunciation,
      WordPronunciationEntity
    > = {
      getDomainId: (p) => p.id,
      getEntityId: (e) => e.id,
      createEntity: (p) => WordPronunciationMapper.toEntity(p, wordEntity),
      updateEntity: (p, e) => WordPronunciationMapper.updateEntity(p, e),
    };

    await syncCollection(
      [...domain.pronunciations],
      wordEntity.pronunciations.getItems(),
      wordEntity.pronunciations,
      em,
      config,
    );
  }

  private static async syncSenses(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    await wordEntity.senses.init({ populate: ['exampleEntities'] });
    const existingSenses = wordEntity.senses.getItems();

    const config: CollectionSyncConfig<WordSense, WordSenseEntity> = {
      getDomainId: (s) => s.id,
      getEntityId: (e) => e.id,
      createEntity: (s) => WordSenseMapper.toEntity(s, wordEntity),
      updateEntity: (s, e) => WordSenseMapper.updateEntity(s, e),
      onRemove: async (e, entityManager) => {
        // Cascade remove examples first
        for (const ex of e.exampleEntities.getItems()) {
          entityManager.remove(ex);
        }
      },
    };

    await syncCollection(
      [...domain.senses],
      existingSenses,
      wordEntity.senses,
      em,
      config,
    );

    // Sync examples for each sense
    const senseMap = new Map(
      wordEntity.senses.getItems().map((s) => [s.id, s]),
    );

    for (const domainSense of domain.senses) {
      const senseEntity = senseMap.get(domainSense.id);
      if (senseEntity) {
        await this.syncExamples(domainSense, senseEntity, em);
      }
    }
  }

  private static async syncExamples(
    domainSense: WordSense,
    senseEntity: WordSenseEntity,
    em: EntityManager,
  ): Promise<void> {
    // Skip init for newly created senses (collection is empty)
    if (!senseEntity.exampleEntities.isInitialized()) {
      await senseEntity.exampleEntities.init();
    }

    const config: CollectionSyncConfig<WordExample, WordExampleEntity> = {
      getDomainId: (e) => e.id,
      getEntityId: (e) => e.id,
      createEntity: (e) => WordExampleMapper.toEntity(e, senseEntity),
      updateEntity: (e, entity) => WordExampleMapper.updateEntity(e, entity),
    };

    await syncCollection(
      [...domainSense.examples],
      senseEntity.exampleEntities.getItems(),
      senseEntity.exampleEntities,
      em,
      config,
    );
  }
}
