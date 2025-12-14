import { Global, Injectable, Module, Provider } from '@nestjs/common';

import {
  AccountEntity,
  SessionEntity,
  TenantEntity,
  TopicEntity,
  UserEntity,
  WordEntity,
} from '@app/entities';
import { RequestContextService } from '@app/request';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountRepository } from './account.repository';
import { SessionRepository } from './session.repository';
import { TenantRepository } from './tenant.repository';
import { TopicRepository } from './topic.repository';
import { UserRepository } from './user.repository';
import { WordRepository } from './word.repository';

export const UNIT_OF_WORK = Symbol('UnitOfWork');

export interface UnitOfWork {
  user: UserRepository;
  account: AccountRepository;
  session: SessionRepository;
  tenant: TenantRepository;
  topic: TopicRepository;
  word: WordRepository;
  save(): Promise<void>;
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): Promise<void>;
  transaction<T>(callback: () => Promise<T>): Promise<T>;
  getEntityManager(): EntityManager;
}

@Injectable()
export class UnitOfWorkImpl implements UnitOfWork {
  private _user?: UserRepository;
  private _account?: AccountRepository;
  private _session?: SessionRepository;
  private _tenant?: TenantRepository;
  private _topic?: TopicRepository;
  private _word?: WordRepository;

  constructor(
    private readonly _em: EntityManager,
    private readonly requestContext: RequestContextService,
  ) {
    this._em = this._em.fork();
    this.enableFilters();
  }

  private enableFilters() {
    this._em.addFilter('deleteFlag', { deleteFlag: false });
  }

  getEntityManager(): EntityManager {
    return this._em;
  }

  get user(): UserRepository {
    if (!this._user) {
      this._user = this._em.getRepository(UserEntity);
    }

    return this._user;
  }

  get account(): AccountRepository {
    if (!this._account) {
      this._account = this._em.getRepository(AccountEntity);
    }

    return this._account;
  }

  get session(): SessionRepository {
    if (!this._session) {
      this._session = this._em.getRepository(SessionEntity);
    }

    return this._session;
  }

  get tenant(): TenantRepository {
    if (!this._tenant) {
      this._tenant = this._em.getRepository(TenantEntity);
    }
    return this._tenant;
  }

  get topic(): TopicRepository {
    if (!this._topic) {
      this._topic = this._em.getRepository(TopicEntity);
    }
    return this._topic;
  }

  get word(): WordRepository {
    if (!this._word) {
      this._word = this._em.getRepository(WordEntity);
    }
    return this._word;
  }

  save(): Promise<void> {
    return this._em.flush();
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  async start() {
    await this._em.begin();
  }

  async commit() {
    await this._em.flush();
    await this._em.commit();
  }

  async rollback() {
    await this._em.rollback();
  }

  async release() {
    // No-op for now unless we need to manually clear context
  }
}

export const provideUnitOfWork = (): Provider => ({
  provide: UNIT_OF_WORK,
  useClass: UnitOfWorkImpl,
});

@Global()
@Module({
  providers: [provideUnitOfWork()],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
