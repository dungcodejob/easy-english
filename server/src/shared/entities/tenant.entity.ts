import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  OneToOne,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Account } from './account.entity';

@Entity()
export class Tenant {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property({ unique: true })
  slug: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @OneToOne(() => Account)
  owner: Account;

  @OneToMany(() => Account, (account) => account.tenant)
  accounts = new Collection<Account>(this);

  constructor({
    name,
    slug,
    owner,
  }: {
    name: string;
    slug: string;
    owner: Account;
  }) {
    this.name = name;
    this.slug = slug;
    this.owner = owner;
  }
}
