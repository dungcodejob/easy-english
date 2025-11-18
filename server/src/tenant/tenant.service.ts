import { Tenant } from '@app/entities';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

type TenantCreateInput = ConstructorParameters<typeof Tenant>[0];

@Injectable()
export class TenantService {
  private readonly _repository: EntityRepository<Tenant>;
  constructor(protected readonly em: EntityManager) {
    this._repository = this.em.getRepository(Tenant);
  }

  create(data: TenantCreateInput): Tenant {
    const tenant = new Tenant(data);
    return this._repository.create(tenant);
  }

  flush(): Promise<void> {
    return this.em.flush();
  }
}
