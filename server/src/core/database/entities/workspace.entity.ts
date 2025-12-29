import { WorkspaceRepository } from '@app/repositories';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { v7 } from 'uuid';
import { BaseEntityWithTenant } from './base-extend.entity';

export enum Language {
  EN = 'en',
}

@Entity({ repository: () => WorkspaceRepository })
export class WorkspaceEntity extends BaseEntityWithTenant {
  @Property({ unique: true })
  name: string;

  @Property()
  description: string;

  @Enum({ items: () => Language })
  language: Language;

  @Property()
  userId: string;

  [EntityRepositoryType]?: WorkspaceRepository;

  constructor(data: Partial<WorkspaceEntity>) {
    super();
    this.id = v7();
    Object.assign(this, data);
  }
}
