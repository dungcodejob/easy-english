import { TopicSenseEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class TopicSenseRepository extends EntityRepository<TopicSenseEntity> {}
