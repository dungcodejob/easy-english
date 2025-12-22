import { REQUEST_KEY } from '@app/constants';
import { TenantEntity } from '@app/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type TenantRecord = keyof TenantEntity;

export const CurrentTenant = createParamDecorator(
  (key: TenantRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const tenant = request.user[REQUEST_KEY.CURRENT_TENANT];

    if (!tenant) {
      return null;
    }

    return key ? tenant[key] : tenant;
  },
);
