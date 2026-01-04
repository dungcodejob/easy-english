import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAuth, CurrentUser } from '@app/decorators';
import { LearningStatus } from '@app/entities';
import { ApiCustomQuery, ResponseBuilder } from '@app/models';
import { WorkspaceGuard } from '../workspace/guards/workspace.guard';
import {
  CreateTopicSenseDto,
  ReviewTopicSenseDto,
  UpdateTopicSenseDto,
} from './dto';
import { TopicSenseService } from './topic-sense.service';

@ApiTags('Topic Sense')
@Controller('topics/:topicId')
export class TopicSenseController {
  constructor(private readonly topicSenseService: TopicSenseService) {}

  @ApiAuth({
    summary: 'Add dictionary sense to topic',
  })
  @UseGuards(WorkspaceGuard)
  @Post('senses')
  async create(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Body() dto: CreateTopicSenseDto,
  ) {
    const data = await this.topicSenseService.create(userId, topicId, dto);
    return ResponseBuilder.toSingle({ data });
  }

  @ApiAuth({
    summary: 'Get all senses in topic',
  })
  @ApiCustomQuery()
  @UseGuards(WorkspaceGuard)
  @Get('senses')
  async findAll(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: LearningStatus,
  ) {
    const [items, count] = await this.topicSenseService.findAll(
      userId,
      topicId,
      page,
      limit,
      status,
    );
    return ResponseBuilder.toList({ items, meta: { count } });
  }

  @ApiAuth({
    summary: 'Get review queue for topic',
  })
  @UseGuards(WorkspaceGuard)
  @Get('review-queue')
  async getReviewQueue(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Query('limit') limit: number = 20,
  ) {
    const items = await this.topicSenseService.getReviewQueue(
      userId,
      topicId,
      limit,
    );
    return ResponseBuilder.toList({ items, meta: { count: items.length } });
  }

  @ApiAuth({
    summary: 'Update sense customization',
  })
  @UseGuards(WorkspaceGuard)
  @Patch('senses/:id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTopicSenseDto,
  ) {
    const data = await this.topicSenseService.update(userId, topicId, id, dto);
    return ResponseBuilder.toSingle({ data });
  }

  @ApiAuth({
    summary: 'Remove sense from topic',
  })
  @UseGuards(WorkspaceGuard)
  @Delete('senses/:id')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
  ) {
    await this.topicSenseService.remove(userId, topicId, id);
    return ResponseBuilder.toSingle({ data: null });
  }

  @ApiAuth({
    summary: 'Record review result (SM-2)',
  })
  @UseGuards(WorkspaceGuard)
  @Post('senses/:id/review')
  async recordReview(
    @CurrentUser('id') userId: string,
    @Param('topicId') topicId: string,
    @Param('id') id: string,
    @Body() dto: ReviewTopicSenseDto,
  ) {
    const data = await this.topicSenseService.recordReview(
      userId,
      topicId,
      id,
      dto,
    );
    return ResponseBuilder.toSingle({ data });
  }
}
