import { EntityRepository } from '@mikro-orm/core';
import { ExampleEntity } from '../entities/example.entity';

export class ExampleRepository extends EntityRepository<ExampleEntity> {}
