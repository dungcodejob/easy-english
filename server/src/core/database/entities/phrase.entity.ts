import { PhraseRepository } from '@app/repositories';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';
import { WordEntity } from './word.entity';

@Entity({ repository: () => PhraseRepository })
@Unique({ properties: ['text'] })
export class PhraseEntity extends BaseEntity {
  @Property({ type: 'text' })
  text: string;

  @Property({ type: 'text', nullable: true })
  definition?: string;

  @Property({ type: 'text', nullable: true, fieldName: 'definition_vi' })
  definitionVi?: string;

  @ManyToMany(() => WordEntity, (word) => word.phrases)
  words = new Collection<WordEntity>(this);

  [EntityRepositoryType]?: PhraseRepository;

  constructor(data: Partial<PhraseEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
