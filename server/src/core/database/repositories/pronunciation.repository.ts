import { WordPronunciationEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class WordPronunciationRepository extends EntityRepository<WordPronunciationEntity> {}
