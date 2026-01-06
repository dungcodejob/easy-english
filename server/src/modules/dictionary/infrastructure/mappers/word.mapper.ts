import type { WordFamily, WordInflects } from '@app/domain/dictionary';
import { Word } from '@app/domain/dictionary';
import { EntityManager } from '@mikro-orm/postgresql';
import { CollectionSyncConfig, syncCollection } from './collection-syncer';
// Import Domain Interfaces
import type {
  CreatePronunciationData,
  CreateWordData,
} from '@app/domain/dictionary/models/word';

import type { CreateSenseData } from '@app/domain/dictionary/models/word-sense';
import {
  WordEntity,
  WordExampleEntity,
  WordPronunciationEntity,
  WordSenseEntity,
} from '@app/entities';

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
        ? entity.pronunciations.getItems().map((p) => ({
            id: p.id,
            ipa: p.ipa,
            audioUrl: p.audioUrl,
            region: p.region,
          }))
        : [];

    const senses: CreateSenseData[] = entity.senses?.isInitialized()
      ? entity.senses.getItems().map((s) => ({
          id: s.id,
          partOfSpeech: s.partOfSpeech,
          definition: s.definition,
          definitionVi: s.definitionVi,
          shortDefinition: s.shortDefinition,
          senseIndex: s.senseIndex,
          source: s.source,
          externalId: s.externalId,
          cefrLevel: s.cefrLevel,
          images: s.images,
          collocations: s.collocations,
          relatedWords: s.relatedWords,
          idioms: s.idioms,
          phrases: s.phrases,
          verbPhrases: s.verbPhrases,
          synonyms: s.synonyms,
          antonyms: s.antonyms,
          updateBy: s.updateBy,
          examples: s.exampleEntities?.isInitialized()
            ? s.exampleEntities.getItems().map((e) => ({
                id: e.id,
                text: e.text,
                translationVi: e.translationVi,
                order: e.order,
                externalId: e.externalId,
              }))
            : [],
        }))
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
      (wordEntity as any).id = domain.id;
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

    const config: CollectionSyncConfig<any, WordPronunciationEntity> = {
      getDomainId: (p) => p.id,
      getEntityId: (e) => e.id,
      createEntity: (p) => {
        const entity = new WordPronunciationEntity({
          word: wordEntity,
          ipa: p.ipa,
          audioUrl: p.audioUrl,
          region: p.region,
        });
        (entity as any).id = p.id;
        return entity;
      },
      updateEntity: (p, e) => {
        e.ipa = p.ipa;
        e.audioUrl = p.audioUrl;
        e.region = p.region;
      },
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

    const config: CollectionSyncConfig<any, WordSenseEntity> = {
      getDomainId: (s) => s.id,
      getEntityId: (e) => e.id,
      createEntity: (s) => {
        const entity = new WordSenseEntity({
          word: wordEntity,
          partOfSpeech: s.partOfSpeech,
          definition: s.definition,
          senseIndex: s.senseIndex,
          source: s.source,
        });
        (entity as any).id = s.id;
        return entity;
      },
      updateEntity: (s, e) => {
        e.definition = s.definition;
        e.shortDefinition = s.shortDefinition;
        e.cefrLevel = s.cefrLevel;
        e.images = [...s.images];
        e.synonyms = [...s.synonyms];
        e.antonyms = [...s.antonyms];
        e.idioms = [...s.idioms];
        e.phrases = [...s.phrases];
        e.verbPhrases = [...s.verbPhrases];
        e.collocations = [...s.collocations];
        e.relatedWords = [...s.relatedWords];
        e.definitionVi = s.definitionVi;
        e.externalId = s.externalId;
      },
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
    domainSense: any,
    senseEntity: WordSenseEntity,
    em: EntityManager,
  ): Promise<void> {
    // Skip init for newly created senses (collection is empty)
    if (!senseEntity.exampleEntities.isInitialized()) {
      await senseEntity.exampleEntities.init();
    }

    const config: CollectionSyncConfig<any, any> = {
      getDomainId: (e) => e.id,
      getEntityId: (e) => e.id,
      createEntity: (e) => {
        const entity = new WordExampleEntity({
          id: e.id,
          sense: senseEntity,
          text: e.text,
          translationVi: e.translationVi,
          order: e.order,
          externalId: e.externalId,
        });
        (entity as any).id = e.id;
        return entity;
      },
      updateEntity: (e, entity) => {
        entity.text = e.text;
        entity.translationVi = e.translationVi;
        entity.order = e.order;
      },
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
