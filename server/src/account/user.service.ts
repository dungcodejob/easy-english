import { User } from '@app/entities';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

type UserCreateInput = ConstructorParameters<typeof User>[0];

@Injectable()
export class UserService {
  private readonly _repository: EntityRepository<User>;
  constructor(private em: EntityManager) {
    this._repository = this.em.getRepository(User);
  }

  create(data: UserCreateInput): User {
    const user = new User(data);
    return this._repository.create(user);
  }
}
