import { EntityRepository } from '@mikro-orm/core';
import { VocabSetEntity } from '../entities/vocab-set.entity';

export class VocabSetRepository extends EntityRepository<VocabSetEntity> {}
