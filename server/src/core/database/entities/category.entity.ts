import { CategoryRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { CollectionEntity } from './collection.entity';
import { VocabSetEntity } from './vocab-set.entity';

@Entity({ repository: () => CategoryRepository })
@Unique({ properties: ['externalId'] })
export class CategoryEntity extends BaseEntity {
  @Property({ fieldName: 'external_id' })
  externalId: string;

  @Property()
  name: string;

  @ManyToOne(() => CollectionEntity)
  @Index()
  collection: CollectionEntity;

  @OneToMany(() => VocabSetEntity, (set) => set.category)
  sets = new Collection<VocabSetEntity>(this);

  [EntityRepositoryType]?: CategoryRepository;

  constructor(data: Partial<CategoryEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
