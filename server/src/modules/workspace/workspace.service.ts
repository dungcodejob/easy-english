import { WorkspaceEntity } from '@app/entities';
import { AuthEventContext, QueryDto } from '@app/models';
import { UNIT_OF_WORK, type UnitOfWork } from '@app/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateWorkspaceDto,
  GetWorkspacesDto,
  UpdateWorkspaceDto,
} from './models';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly _unitOfWork: UnitOfWork,
  ) {}

  async create(
    data: CreateWorkspaceDto & AuthEventContext,
  ): Promise<WorkspaceEntity> {
    const workspace = new WorkspaceEntity(data);
    workspace.tenant = this._unitOfWork.tenant.getReference(data.tenantId);
    workspace.userId = data.userId;
    this._unitOfWork.workspace.create(workspace);
    await this._unitOfWork.save();
    return workspace;
  }

  async findAll(
    dto: GetWorkspacesDto,
    userId: string,
  ): Promise<[WorkspaceEntity[], number]> {
    const filterQuery = QueryDto.setConditionFilter<WorkspaceEntity>(
      { userId }, // Enforce user scoping
      dto.filters,
    );

    const options: any = QueryDto.setConditionSort<WorkspaceEntity>(
      {
        orderBy: { createAt: 'DESC' },
      },
      dto.sorts,
    );

    return this._unitOfWork.workspace.findAndCount(filterQuery, options);
  }

  async findOne(id: string, userId: string): Promise<WorkspaceEntity> {
    const workspace = await this._unitOfWork.workspace.findOne({ id, userId });
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }
    // Also implicit check for userId via filter in findOne if I passed it,
    // but findOne({id, userId}) does explicit check.
    return workspace;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const workspace = await this.findOne(id, userId);

    this._unitOfWork.workspace.assign(workspace, data);

    await this._unitOfWork.save();
    return workspace;
  }

  async remove(id: string, userId: string): Promise<void> {
    const workspace = await this.findOne(id, userId);
    this._unitOfWork.getEntityManager().remove(workspace);
    await this._unitOfWork.save();
  }
}
