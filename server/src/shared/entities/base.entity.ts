import { Entity, Property } from '@mikro-orm/core';
import { IdentifiableEntity } from './identifiable.entity';

@Entity({ abstract: true })
export class BaseEntity extends IdentifiableEntity {
  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createAt: Date = new Date();

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updateAt: Date = new Date();
}
