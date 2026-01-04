import { EntityRepository } from '@mikro-orm/core';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryRepository extends EntityRepository<CategoryEntity> {}
