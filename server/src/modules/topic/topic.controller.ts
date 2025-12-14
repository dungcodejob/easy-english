import { ApiAuth } from '@app/decorators';
import { ResponseBuilder } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTopicDto } from './models/create-topic.dto';
import { UpdateTopicDto } from './models/update-topic.dto';
import { TopicService } from './topic.service';

@ApiTags('topics')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiAuth({
    auths: ['jwt'],
    summary: 'Create a new topic',
  })
  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    const topic = await this.topicService.create(createTopicDto);
    return ResponseBuilder.toSingle({ data: topic });
  }

  @ApiAuth({
    auths: ['jwt'],
    summary: 'Get all topics',
  })
  @Get()
  async findAll(@Query() query: any) {
    const [items, total] = await this.topicService.findAll(query);
    return ResponseBuilder.toList({
      items,
      meta: {
        count: total,
      },
    });
  }

  @ApiAuth({
    auths: ['jwt'],
    summary: 'Get a topic by id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const topic = await this.topicService.findOne(id);
    return ResponseBuilder.toSingle({ data: topic });
  }

  @ApiAuth({
    auths: ['jwt'],
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
    auths: ['jwt'],
    summary: 'Delete a topic',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.topicService.remove(id);
    return ResponseBuilder.toSingle({ data: null });
  }
}
