import type { CreateSenseData } from '@app/domain/dictionary/models/word-sense';
import { WordSense } from '@app/domain/dictionary/models/word-sense';
import { WordEntity, WordSenseEntity } from '@app/entities';
import { WordExampleMapper } from './word-example.mapper';

export class WordSenseMapper {
  /**
   * Convert MikroORM WordSenseEntity to domain CreateSenseData
   */
  static toDomain(entity: WordSenseEntity): CreateSenseData {
    return {
      id: entity.id,
      partOfSpeech: entity.partOfSpeech,
      definition: entity.definition,
      definitionVi: entity.definitionVi,
      shortDefinition: entity.shortDefinition,
      senseIndex: entity.senseIndex,
      source: entity.source,
      externalId: entity.externalId,
      cefrLevel: entity.cefrLevel,
      images: entity.images,
      collocations: entity.collocations,
      relatedWords: entity.relatedWords,
      idioms: entity.idioms,
      phrases: entity.phrases,
      verbPhrases: entity.verbPhrases,
      synonyms: entity.synonyms ?? [],
      antonyms: entity.antonyms ?? [],
      updateBy: entity.updateBy,
      examples: entity.exampleEntities?.isInitialized()
        ? entity.exampleEntities
            .getItems()
            .map((e) => WordExampleMapper.toDomain(e))
        : [],
    };
  }

  /**
   * Convert domain WordSense to MikroORM WordSenseEntity
   */
  static toEntity(domain: WordSense, wordEntity: WordEntity): WordSenseEntity {
    const entity = new WordSenseEntity({
      id: domain.id,
      word: wordEntity,
      source: domain.source,
      senseIndex: domain.senseIndex,
      externalId: domain.externalId,
      partOfSpeech: domain.partOfSpeech,
      definition: domain.definition,
      shortDefinition: domain.shortDefinition,
      cefrLevel: domain.cefrLevel,
      images: domain.images,
      synonyms: domain.synonyms,
      antonyms: domain.antonyms,
      idioms: domain.idioms,
      phrases: domain.phrases,
      verbPhrases: domain.verbPhrases,
      collocations: domain.collocations,
      relatedWords: domain.relatedWords,
      definitionVi: domain.definitionVi,
      updateBy: domain.updateBy,
    });

    return entity;
  }

  /**
   * Update MikroORM WordSenseEntity from domain WordSense
   */
  static updateEntity(domain: WordSense, entity: WordSenseEntity): void {
    entity.partOfSpeech = domain.partOfSpeech;
    entity.definition = domain.definition;
    entity.shortDefinition = domain.shortDefinition;
    entity.cefrLevel = domain.cefrLevel;
    entity.images = [...domain.images];
    entity.synonyms = [...domain.synonyms];
    entity.antonyms = [...domain.antonyms];
    entity.idioms = [...domain.idioms];
    entity.phrases = [...domain.phrases];
    entity.verbPhrases = [...domain.verbPhrases];
    entity.collocations = [...domain.collocations];
    entity.relatedWords = [...domain.relatedWords];
    entity.definitionVi = domain.definitionVi;
    entity.updateBy = domain.updateBy;
    entity.senseIndex = domain.senseIndex;
    entity.source = domain.source;
  }
}
