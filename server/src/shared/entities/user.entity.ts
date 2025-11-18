import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Account } from './account.entity';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Enum(() => Role)
  role: Role = Role.USER;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @OneToMany(() => Account, (account) => account.user)
  accounts = new Collection<Account>(this);

  constructor({ name, role }) {
    this.name = name;
    this.role = role;
  }
}
