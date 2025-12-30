import { FEATURE_KEY } from '@app/constants';
import { ApiAuth, CurrentTenant, CurrentUser } from '@app/decorators';
import { ApiCustomQuery, ResponseBuilder } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTopicDto, GetTopicsDto } from './models';
import { UpdateTopicDto } from './models/update-topic.dto';
import { TopicService } from './topic.service';

import { WorkspaceGuard } from '../workspace/guards/workspace.guard';

@ApiTags(FEATURE_KEY.TOPIC)
@Controller(FEATURE_KEY.TOPIC)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiAuth({
    summary: 'Create a new topic',
  })
  @UseGuards(WorkspaceGuard)
  @Post()
  async create(
    @Body() createTopicDto: CreateTopicDto,
    @CurrentTenant('id') tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    const topic = await this.topicService.create({
      ...createTopicDto,
      tenantId,
      userId,
    });
    return ResponseBuilder.toSingle({ data: topic });
  }

  @ApiAuth({
    summary: 'Get all topics',
  })
  @ApiCustomQuery()
  @Get()
  async findAll(@Query() query: GetTopicsDto) {
    const [items, total] = await this.topicService.findAll(query);
    return ResponseBuilder.toList({
      items,
      meta: {
        count: total,
      },
    });
  }

  @ApiAuth({
    summary: 'Get a topic by id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const topic = await this.topicService.findOne(id);
    return ResponseBuilder.toSingle({ data: topic });
  }

  @ApiAuth({
    summary: 'Update a topic',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    const topic = await this.topicService.update(id, updateTopicDto);
    return ResponseBuilder.toSingle({ data: topic });
  }

  @ApiAuth({
    summary: 'Delete a topic',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.topicService.remove(id);
    return ResponseBuilder.toSingle({ data: null });
  }
}
