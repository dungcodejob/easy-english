import { FEATURE_KEY } from '@app/constants';
import { ApiAuth, CurrentTenant, CurrentUser } from '@app/decorators';
import { ApiCustomQuery, ResponseBuilder } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateWorkspaceDto,
  GetWorkspacesDto,
  UpdateWorkspaceDto,
} from './models';
import { WorkspaceService } from './workspace.service';

@ApiTags(FEATURE_KEY.WORKSPACE)
@Controller(FEATURE_KEY.WORKSPACE)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiAuth({
    summary: 'Create a new workspace',
  })
  @Post()
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser('id') userId: string,
    @CurrentTenant('id') tenantId: string,
  ) {
    const workspace = await this.workspaceService.create({
      ...createWorkspaceDto,
      tenantId,
      userId,
    });
    return ResponseBuilder.toSingle({ data: workspace });
  }

  @ApiAuth({
    summary: 'Get all workspaces',
  })
  @ApiCustomQuery()
  @Get()
  async findAll(
    @Query() query: GetWorkspacesDto,
    @CurrentUser('id') userId: string,
  ) {
    const [items, total] = await this.workspaceService.findAll(query, userId);
    return ResponseBuilder.toList({
      items,
      meta: {
        count: total,
      },
    });
  }

  @ApiAuth({
    summary: 'Get a workspace by id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const workspace = await this.workspaceService.findOne(id, userId);
    return ResponseBuilder.toSingle({ data: workspace });
  }

  @ApiAuth({
    summary: 'Update a workspace',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentUser('id') userId: string,
  ) {
    const workspace = await this.workspaceService.update(
      id,
      userId,
      updateWorkspaceDto,
    );
    return ResponseBuilder.toSingle({ data: workspace });
  }

  @ApiAuth({
    summary: 'Delete a workspace',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.workspaceService.remove(id, userId);
    return ResponseBuilder.toSingle({ data: null });
  }
}
