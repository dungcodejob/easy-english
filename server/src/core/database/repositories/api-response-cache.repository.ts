import { ApiResponseCacheEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class ApiResponseCacheRepository extends EntityRepository<ApiResponseCacheEntity> {}
