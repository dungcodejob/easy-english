import { TopicEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class TopicRepository extends EntityRepository<TopicEntity> {}
