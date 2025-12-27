import { WordSenseEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class WordSenseRepository extends EntityRepository<WordSenseEntity> {}
