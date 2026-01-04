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

/**
 * WordMapper
 *
 * Maps between domain models and MikroORM entities.
 * This ensures the domain layer remains free of persistence concerns.
 */
export class WordMapper {
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
   * Creates or updates the entity and all children
   */
  static toEntity(
    domain: Word,
    em: EntityManager,
    existingEntity?: WordEntity,
  ): WordEntity {
    // Create or update word entity
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

    // If new entity, we need to set the id from domain
    if (!existingEntity) {
      (wordEntity as any).id = domain.id;
    }

    return wordEntity;
  }

  /**
   * Sync child entities (pronunciations, senses, examples)
   * This handles creating new, updating existing, and removing deleted children
   */
  static async syncChildren(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    // Sync Pronunciations
    await this.syncPronunciations(domain, wordEntity, em);

    // Sync Senses (and their examples)
    await this.syncSenses(domain, wordEntity, em);
  }

  private static async syncPronunciations(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    const domainPronIds = new Set(domain.pronunciations.map((p) => p.id));

    // Load existing pronunciations
    await wordEntity.pronunciations.init();
    const existingProns = wordEntity.pronunciations.getItems();

    // Remove pronunciations not in domain
    for (const existing of existingProns) {
      if (!domainPronIds.has(existing.id)) {
        wordEntity.pronunciations.remove(existing);
        em.remove(existing);
      }
    }

    // Add or update pronunciations
    const existingPronIds = new Set(existingProns.map((p) => p.id));
    for (const domainPron of domain.pronunciations) {
      if (!existingPronIds.has(domainPron.id)) {
        const pronEntity = new PronunciationEntity({
          word: wordEntity,
          ipa: domainPron.ipa,
          audioUrl: domainPron.audioUrl,
          region: domainPron.region,
        });
        (pronEntity as any).id = domainPron.id;
        wordEntity.pronunciations.add(pronEntity);
        em.persist(pronEntity);
      }
    }
  }

  private static async syncSenses(
    domain: Word,
    wordEntity: WordEntity,
    em: EntityManager,
  ): Promise<void> {
    const domainSenseIds = new Set(domain.senses.map((s) => s.id));

    // Load existing senses
    await wordEntity.senses.init({ populate: ['exampleEntities'] });
    const existingSenses = wordEntity.senses.getItems();

    // Remove senses not in domain
    for (const existing of existingSenses) {
      if (!domainSenseIds.has(existing.id)) {
        // Remove examples first
        for (const ex of existing.exampleEntities.getItems()) {
          em.remove(ex);
        }
        wordEntity.senses.remove(existing);
        em.remove(existing);
      }
    }

    // Add or update senses
    const existingSenseMap = new Map(existingSenses.map((s) => [s.id, s]));
    for (const domainSense of domain.senses) {
      let senseEntity = existingSenseMap.get(domainSense.id);

      if (!senseEntity) {
        // Create new sense
        senseEntity = new WordSenseEntity({
          word: wordEntity,
          partOfSpeech: domainSense.partOfSpeech,
          definition: domainSense.definition,
          senseIndex: domainSense.senseIndex,
          source: domainSense.source,
        });
        (senseEntity as any).id = domainSense.id;
        wordEntity.senses.add(senseEntity);
        em.persist(senseEntity);
      }

      // Update sense fields
      senseEntity.definition = domainSense.definition;
      senseEntity.shortDefinition = domainSense.shortDefinition;
      senseEntity.cefrLevel = domainSense.cefrLevel;
      senseEntity.images = domainSense.images;
      senseEntity.synonyms = domainSense.synonyms;
      senseEntity.antonyms = domainSense.antonyms;
      senseEntity.idioms = domainSense.idioms;
      senseEntity.phrases = domainSense.phrases;
      senseEntity.verbPhrases = domainSense.verbPhrases;
      senseEntity.collocations = domainSense.collocations;
      senseEntity.relatedWords = domainSense.relatedWords;
      senseEntity.definitionVi = domainSense.definitionVi;
      senseEntity.externalId = domainSense.externalId;

      // Sync examples
      await this.syncExamples(domainSense, senseEntity, em);
    }
  }

  private static async syncExamples(
    domainSense: WordSense,
    senseEntity: WordSenseEntity,
    em: EntityManager,
  ): Promise<void> {
    const domainExampleIds = new Set(domainSense.examples.map((e) => e.id));

    await senseEntity.exampleEntities.init();
    const existingExamples = senseEntity.exampleEntities.getItems();

    // Remove examples not in domain
    for (const existing of existingExamples) {
      if (!domainExampleIds.has(existing.id)) {
        senseEntity.exampleEntities.remove(existing);
        em.remove(existing);
      }
    }

    // Add or update examples
    const existingExampleMap = new Map(existingExamples.map((e) => [e.id, e]));
    for (const domainExample of domainSense.examples) {
      let exampleEntity = existingExampleMap.get(domainExample.id);

      if (!exampleEntity) {
        exampleEntity = new ExampleEntity({
          sense: senseEntity,
          text: domainExample.text,
          translationVi: domainExample.translationVi,
          order: domainExample.order,
          externalId: domainExample.externalId,
        });
        (exampleEntity as any).id = domainExample.id;
        senseEntity.exampleEntities.add(exampleEntity);
        em.persist(exampleEntity);
      } else {
        // Update
        exampleEntity.text = domainExample.text;
        exampleEntity.translationVi = domainExample.translationVi;
        exampleEntity.order = domainExample.order;
      }
    }
  }
}
