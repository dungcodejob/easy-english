import { Module } from '@nestjs/common';
import { WorkspaceGuard } from './guards/workspace.guard';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGuard],
  exports: [WorkspaceService, WorkspaceGuard],
})
export class WorkspaceModule {}
