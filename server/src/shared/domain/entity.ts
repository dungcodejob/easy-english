import { v7 } from 'uuid';

export abstract class Entity<TId = string> {
  readonly id: TId;
  readonly createdAt: Date;
  updatedAt: Date;

  protected constructor(id?: TId) {
    this.id = id ?? (v7() as TId);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  equals(other: Entity<TId>): boolean {
    if (!(other instanceof Entity)) return false;
    return this.id === other.id;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }
}
