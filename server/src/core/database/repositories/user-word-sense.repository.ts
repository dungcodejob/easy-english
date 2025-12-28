import { UserWordSenseEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserWordSenseRepository extends EntityRepository<UserWordSenseEntity> {}
