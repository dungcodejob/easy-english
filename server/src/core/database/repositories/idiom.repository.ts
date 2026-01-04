import { EntityRepository } from '@mikro-orm/core';
import { IdiomEntity } from '../entities/idiom.entity';

export class IdiomRepository extends EntityRepository<IdiomEntity> {}
