import { Global, Injectable, Module, Provider } from '@nestjs/common';

import {
  AccountEntity,
  SessionEntity,
  TenantEntity,
  TopicEntity,
  UserEntity,
} from '@app/entities';
import { RequestContextService } from '@app/request';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountRepository } from './account.repository';
import { SessionRepository } from './session.repository';
import { TenantRepository } from './tenant.repository';
import { TopicRepository } from './topic.repository';
import { UserRepository } from './user.repository';

export const UNIT_OF_WORK = Symbol('UnitOfWork');

export interface UnitOfWork {
  user: UserRepository;
  account: AccountRepository;
  session: SessionRepository;
  tenant: TenantRepository;
  topic: TopicRepository;
  save(): Promise<void>;
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
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

  constructor(
    private readonly _em: EntityManager,
    private readonly _ctx: RequestContextService,
  ) {
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
}

export const provideUnitOfWork = (): Provider => ({
  provide: UNIT_OF_WORK,
  useClass: UnitOfWorkImpl,
});

@Global()
@Module({
  providers: [
    // {
    //   provide: UNIT_OF_WORK,
    //   scope: Scope.REQUEST,
    //   inject: [EntityManager],
    //   useFactory: (em: EntityManager) => {
    //     // em.setFilterParams('tenant', {
    //     //   tenantId: tenantProvider.getTenantId(),
    //     // });
    //     return new UnitOfWorkImpl(em);
    //   },
    // },
    provideUnitOfWork(),
  ],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
