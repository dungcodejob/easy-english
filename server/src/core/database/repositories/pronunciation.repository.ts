import { PronunciationEntity } from '@app/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

export class PronunciationRepository extends EntityRepository<PronunciationEntity> {}
