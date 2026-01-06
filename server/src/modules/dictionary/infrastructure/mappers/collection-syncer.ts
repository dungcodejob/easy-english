import { Collection, EntityManager } from '@mikro-orm/core';

/**
 * Configuration for syncing a domain collection to entity collection
 */
export interface CollectionSyncConfig<D, E> {
  /** Get the ID of a domain item */
  getDomainId: (domain: D) => string;

  /** Get the ID of an entity */
  getEntityId: (entity: E) => string;

  /** Create a new entity from domain item */
  createEntity: (domain: D) => E;

  /** Update an existing entity with domain data */
  updateEntity: (domain: D, entity: E) => void;

  /** Optional: Custom logic when removing an entity (e.g., cascade delete children) */
  onRemove?: (entity: E, em: EntityManager) => void | Promise<void>;
}

/**
 * Generic utility to sync a domain collection with a MikroORM entity collection.
 *
 * Handles:
 * - Removing orphaned entities (exist in DB but not in domain)
 * - Creating new entities (exist in domain but not in DB)
 * - Updating existing entities
 *
 * @example
 * await syncCollection(
 *   domain.pronunciations,
 *   existingEntities,
 *   wordEntity.pronunciations,
 *   em,
 *   {
 *     getDomainId: (p) => p.id,
 *     getEntityId: (e) => e.id,
 *     createEntity: (p) => new PronunciationEntity({ ... }),
 *     updateEntity: (p, e) => { e.ipa = p.ipa; },
 *   }
 * );
 */
export async function syncCollection<D, E extends object>(
  domainItems: readonly D[],
  existingEntities: E[],
  collection: Collection<E>,
  em: EntityManager,
  config: CollectionSyncConfig<D, E>,
): Promise<void> {
  const { getDomainId, getEntityId, createEntity, updateEntity, onRemove } =
    config;

  // Build lookup sets/maps
  const domainIds = new Set(domainItems.map(getDomainId));
  const existingMap = new Map(existingEntities.map((e) => [getEntityId(e), e]));

  // 1. Remove orphaned entities (exist in DB but not in domain)
  for (const existing of existingEntities) {
    if (!domainIds.has(getEntityId(existing))) {
      if (onRemove) {
        await onRemove(existing, em);
      }
      collection.remove(existing);
      em.remove(existing);
    }
  }

  // 2. Add new or update existing
  for (const domainItem of domainItems) {
    const existing = existingMap.get(getDomainId(domainItem));

    if (!existing) {
      // Create new entity
      const newEntity = createEntity(domainItem);
      collection.add(newEntity);
      em.persist(newEntity);
    } else {
      // Update existing entity
      updateEntity(domainItem, existing);
    }
  }
}
