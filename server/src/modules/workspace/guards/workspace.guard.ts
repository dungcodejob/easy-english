import { ERROR_CODES } from '@app/errors';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(@Inject(UNIT_OF_WORK) private readonly uow: UnitOfWork) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request.user as any)?.id as string | undefined;

    if (!userId) {
      // Guard should be used after AuthGuard, so user should exist.
      // If not, let it pass (or fail if strict). Assuming AuthGuard checks this.
      return true;
    }

    // 1. Check if user has at least one workspace
    const workspaceCount = await this.uow.workspace.count({ userId });

    if (workspaceCount === 0) {
      throw new BadRequestException({
        message: 'Workspace is required for this action',
        code: ERROR_CODES.WORKSPACE.WORKSPACE_REQUIRED,
      });
    }

    // 2. Optionally check if a specific workspaceId is provided in body/query
    // and validate it belongs to user. But the service layer typically does this.
    // The requirement says "Checks if user has at least one workspace".

    // Check if workspaceId is present in body or query
    const workspaceId = request.body?.workspaceId || request.query?.workspaceId;

    if (workspaceId) {
      const workspace = await this.uow.workspace.findOne({
        id: workspaceId,
        userId,
      });
      if (!workspace) {
        throw new BadRequestException('Invalid Workspace ID');
      }
    }

    return true;
  }
}
