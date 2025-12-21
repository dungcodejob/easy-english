import { WordCacheEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class WordCacheRepository extends EntityRepository<WordCacheEntity> {}
