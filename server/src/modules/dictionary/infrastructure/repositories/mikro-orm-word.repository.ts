import { IWordAggregateRepository, Word } from '@app/domain/dictionary';
// Use import type for interface to avoid runtime metadata emission error
import type { IEventPublisher } from '@app/domain/dictionary/services';
import { EVENT_PUBLISHER } from '@app/domain/dictionary/services';
import { WordEntity } from '@app/entities';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { WordMapper } from '../mappers/word.mapper';

/**
 * MikroORM implementation of the Word Aggregate Repository
 */
@Injectable()
export class MikroOrmWordRepository implements IWordAggregateRepository {
  constructor(
    private readonly em: EntityManager,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async findById(id: string): Promise<Word | null> {
    const entity = await this.em.findOne(
      WordEntity,
      { id },
      {
        populate: ['pronunciations', 'senses', 'senses.exampleEntities'],
      },
    );

    if (!entity) return null;
    return WordMapper.toDomain(entity);
  }

  async findByNormalizedText(
    text: string,
    language: string,
  ): Promise<Word | null> {
    const entity = await this.em.findOne(
      WordEntity,
      { normalizedText: text.toLowerCase(), language },
      {
        populate: ['pronunciations', 'senses', 'senses.exampleEntities'],
        orderBy: { senses: { senseIndex: 'ASC' } },
      },
    );

    if (!entity) return null;
    return WordMapper.toDomain(entity);
  }

  async findByPrefix(
    prefix: string,
    language: string,
    limit = 20,
  ): Promise<Word[]> {
    const entities = await this.em.find(
      WordEntity,
      {
        normalizedText: { $like: `${prefix.toLowerCase()}%` },
        language,
      },
      {
        limit,
        populate: ['pronunciations', 'senses'],
      },
    );

    return entities.map((e) => WordMapper.toDomain(e));
  }

  async save(word: Word): Promise<void> {
    try {
      // Check if entity exists
      const existingEntity = await this.em.findOne(WordEntity, { id: word.id });

      // Map domain to entity
      const wordEntity = WordMapper.toEntity(word, existingEntity ?? undefined);

      if (!existingEntity) {
        this.em.persist(wordEntity);
        // Flush to make entity managed before syncing children
        await this.em.flush();
      }

      // Sync child entities (entity is now managed)
      await WordMapper.syncChildren(word, wordEntity, this.em);

      // Flush all changes
      await this.em.flush();

      // Publish domain events
      await this.eventPublisher.publishAll(word.domainEvents);
      word.clearDomainEvents();
    } catch (error) {
      console.log(error);
    }
  }

  async delete(word: Word): Promise<void> {
    const entity = await this.em.findOne(
      WordEntity,
      { id: word.id },
      { populate: ['pronunciations', 'senses', 'senses.exampleEntities'] },
    );

    if (!entity) return;

    // Remove children first (cascade should handle this, but being explicit)
    for (const sense of entity.senses.getItems()) {
      for (const example of sense.exampleEntities.getItems()) {
        this.em.remove(example);
      }
      this.em.remove(sense);
    }

    for (const pron of entity.pronunciations.getItems()) {
      this.em.remove(pron);
    }

    this.em.remove(entity);
    await this.em.flush();
  }

  async exists(normalizedText: string, language: string): Promise<boolean> {
    const count = await this.em.count(WordEntity, {
      normalizedText: normalizedText.toLowerCase(),
      language,
    });
    return count > 0;
  }
}
