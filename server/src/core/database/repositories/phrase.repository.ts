import { EntityRepository } from '@mikro-orm/core';
import { PhraseEntity } from '../entities/phrase.entity';

export class PhraseRepository extends EntityRepository<PhraseEntity> {}
