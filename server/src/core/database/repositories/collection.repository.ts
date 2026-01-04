import { EntityRepository } from '@mikro-orm/core';
import { CollectionEntity } from '../entities/collection.entity';

export class CollectionRepository extends EntityRepository<CollectionEntity> {}
