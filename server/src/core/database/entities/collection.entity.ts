import { CollectionRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  JsonType,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';

@Entity({ repository: () => CollectionRepository })
@Unique({ properties: ['externalId'] })
export class CollectionEntity extends BaseEntity {
  @Property({ fieldName: 'external_id' })
  externalId: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  brief?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  image?: string;

  @Property({ type: JsonType, nullable: true })
  languages?: string[] = [];

  @OneToMany(() => CategoryEntity, (cat) => cat.collection)
  categories = new Collection<CategoryEntity>(this);

  [EntityRepositoryType]?: CollectionRepository;

  constructor(data: Partial<CollectionEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
