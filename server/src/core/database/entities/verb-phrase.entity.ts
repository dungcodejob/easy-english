import { VerbPhraseRepository } from '@app/repositories';
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

@Entity({ repository: () => VerbPhraseRepository })
@Unique({ properties: ['text'] })
export class VerbPhraseEntity extends BaseEntity {
  @Property({ type: 'text' })
  text: string;

  @Property({ type: 'text', nullable: true })
  definition?: string;

  @Property({ type: 'text', nullable: true, fieldName: 'definition_vi' })
  definitionVi?: string;

  @ManyToMany(() => WordEntity, (word) => word.verbPhrases)
  words = new Collection<WordEntity>(this);

  [EntityRepositoryType]?: VerbPhraseRepository;

  constructor(data: Partial<VerbPhraseEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
