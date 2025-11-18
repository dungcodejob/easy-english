import { SLUG_REGEX } from '@app/constants';
import { Account } from '@app/entities';
import { isNil } from '@app/utils';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { validate } from 'uuid';

type AccountCreateInput = ConstructorParameters<typeof Account>[0];

@Injectable()
export class AccountService {
  private readonly _repository: EntityRepository<Account>;

  constructor(protected readonly em: EntityManager) {
    this._repository = em.repo(Account);
  }

  async findOneByIdOrUsername(idOrUsername: string): Promise<Account | null> {
    const isUUID = validate(idOrUsername);

    if (isUUID) {
      return this.findOneById(idOrUsername);
    }

    if (
      idOrUsername.length < 3 ||
      idOrUsername.length > 106 ||
      !SLUG_REGEX.test(idOrUsername)
    ) {
      throw new BadRequestException('Invalid username');
    }

    return this.findOneByUsername(idOrUsername);
  }

  public async findOneByCredentials(id: string, version: number) {
    const account = await this._repository.findOne(
      {
        id,
        version,
      },
      { populate: ['user'] },
    );

    if (isNil(account)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (account.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return account;
  }

  async findOneById(id: string) {
    return this._repository.findOne(
      {
        id,
      },
      { populate: ['user'] },
    );
  }

  async findOneByUsername(username: string) {
    return this._repository.findOne(
      {
        username,
      },
      { populate: ['user'] },
    );
  }

  async findOneByEmail(email: string) {
    return this._repository.findOne(
      {
        email,
      },
      { populate: ['user'] },
    );
  }

  async count(where: FilterQuery<Account>): Promise<number> {
    return this._repository.count(where);
  }

  create(data: AccountCreateInput): Account {
    const account = new Account(data);
    return this._repository.create(account);
  }

  flush(): Promise<void> {
    return this.em.flush();
  }
}
