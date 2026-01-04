import { EntityRepository } from '@mikro-orm/core';
import { VerbPhraseEntity } from '../entities/verb-phrase.entity';

export class VerbPhraseRepository extends EntityRepository<VerbPhraseEntity> {}
