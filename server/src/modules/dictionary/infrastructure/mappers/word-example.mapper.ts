import type { CreateExampleData } from '@app/domain/dictionary/models/word-example';
import { WordExample } from '@app/domain/dictionary/models/word-example';
import { WordExampleEntity, WordSenseEntity } from '@app/entities';

export class WordExampleMapper {
  /**
   * Convert MikroORM WordExampleEntity to domain CreateExampleData
   */
  static toDomain(entity: WordExampleEntity): CreateExampleData {
    return {
      id: entity.id,
      text: entity.text,
      translationVi: entity.translationVi,
      order: entity.order,
      externalId: entity.externalId,
    };
  }

  /**
   * Convert domain WordExample to MikroORM WordExampleEntity
   */
  static toEntity(
    domain: WordExample,
    senseEntity: WordSenseEntity,
  ): WordExampleEntity {
    const entity = new WordExampleEntity({
      id: domain.id,
      sense: senseEntity,
      text: domain.text,
      translationVi: domain.translationVi,
      order: domain.order,
      externalId: domain.externalId,
    });

    return entity;
  }

  /**
   * Update MikroORM WordExampleEntity from domain WordExample
   */
  static updateEntity(domain: WordExample, entity: WordExampleEntity): void {
    entity.text = domain.text;
    entity.translationVi = domain.translationVi;
    entity.order = domain.order;
  }
}
