import type { WordFamily, WordInflects } from '@app/domain/dictionary';
import {
  Example,
  Pronunciation,
  Word,
  WordSense,
} from '@app/domain/dictionary';
import {
  ExampleEntity,
  PronunciationEntity,
  WordEntity,
  WordSenseEntity,
} from '@app/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { CollectionSyncConfig, syncCollection } from './collection-syncer';

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
    const word = new Word(
      {
        text: entity.text,
        normalizedText: entity.normalizedText,
        language: entity.language,
        rank: entity.rank,
        frequency: entity.frequency,
        source: entity.source,
        inflects: entity.inflects as WordInflects,
        wordFamily: entity.wordFamily as WordFamily,
        updateBy: entity.updateBy,
      },
      entity.id,
    );

    // Load pronunciations
    if (entity.pronunciations?.isInitialized()) {
      const pronunciations = entity.pronunciations.getItems().map(
        (p) =>
          new Pronunciation(
            {
              ipa: p.ipa,
              audioUrl: p.audioUrl,
              region: p.region,
            },
            p.id,
          ),
      );
      word._loadPronunciations(pronunciations);
    }

    // Load senses with examples
    if (entity.senses?.isInitialized()) {
      const senses = entity.senses.getItems().map((s) => {
        const sense = new WordSense(
          {
            partOfSpeech: s.partOfSpeech,
            definition: s.definition,
            senseIndex: s.senseIndex,
            source: s.source,
            shortDefinition: s.shortDefinition,
            cefrLevel: s.cefrLevel,
            images: s.images,
            synonyms: s.synonyms,
            antonyms: s.antonyms,
            idioms: s.idioms,
            phrases: s.phrases,
            verbPhrases: s.verbPhrases,
            collocations: s.collocations,
            relatedWords: s.relatedWords,
            definitionVi: s.definitionVi,
            externalId: s.externalId,
          },
          s.id,
        );

        // Load examples if initialized
        if (s.exampleEntities?.isInitialized()) {
          const examples = s.exampleEntities.getItems().map(
            (e) =>
              new Example(
                {
                  text: e.text,
                  translationVi: e.translationVi,
                  order: e.order,
                  externalId: e.externalId,
                },
                e.id,
              ),
          );
          sense._loadExamples(examples);
        }

        return sense;
      });
      word._loadSenses(senses);
    }

    return word;
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

    const config: CollectionSyncConfig<Pronunciation, PronunciationEntity> = {
      getDomainId: (p) => p.id,
      getEntityId: (e) => e.id,
      createEntity: (p) => {
        const entity = new PronunciationEntity({
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
      domain.pronunciations,
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
        e.images = s.images;
        e.synonyms = s.synonyms;
        e.antonyms = s.antonyms;
        e.idioms = s.idioms;
        e.phrases = s.phrases;
        e.verbPhrases = s.verbPhrases;
        e.collocations = s.collocations;
        e.relatedWords = s.relatedWords;
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
      domain.senses,
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

    const config: CollectionSyncConfig<Example, ExampleEntity> = {
      getDomainId: (e) => e.id,
      getEntityId: (e) => e.id,
      createEntity: (e) => {
        const entity = new ExampleEntity({
          id: e.id,
          sense: senseEntity,
          text: e.text,
          translationVi: e.translationVi,
          order: e.order,
          externalId: e.externalId,
        });
        return entity;
      },
      updateEntity: (e, entity) => {
        entity.text = e.text;
        entity.translationVi = e.translationVi;
        entity.order = e.order;
      },
    };

    await syncCollection(
      domainSense.examples,
      senseEntity.exampleEntities.getItems(),
      senseEntity.exampleEntities,
      em,
      config,
    );
  }
}
