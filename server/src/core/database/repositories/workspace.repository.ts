import { WorkspaceEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class WorkspaceRepository extends EntityRepository<WorkspaceEntity> {}
