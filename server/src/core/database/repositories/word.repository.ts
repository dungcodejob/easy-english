import { WordEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class WordRepository extends EntityRepository<WordEntity> {}
