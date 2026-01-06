import { VocabSetRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Index,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { CategoryEntity } from './category.entity';
import { WordExampleEntity } from './word-example.entity';
import { WordSenseEntity } from './word-sense.entity';

@Entity({ repository: () => VocabSetRepository })
@Unique({ properties: ['externalId'] })
export class VocabSetEntity extends BaseEntity {
  @Property({ fieldName: 'external_id' })
  externalId: string;

  @Property()
  name: string;

  @ManyToOne(() => CategoryEntity)
  @Index()
  category: CategoryEntity;

  @ManyToMany(() => WordSenseEntity, (sense) => sense.vocabSets, {
    owner: true,
  })
  senses = new Collection<WordSenseEntity>(this);

  @ManyToMany(() => WordExampleEntity, (example) => example.vocabSets, {
    owner: true,
  })
  examples = new Collection<WordExampleEntity>(this);

  [EntityRepositoryType]?: VocabSetRepository;

  constructor(data: Partial<VocabSetEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
