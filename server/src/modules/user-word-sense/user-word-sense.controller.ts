import { FEATURE_KEY } from '@app/constants';
import { ApiAuth, CurrentUser } from '@app/decorators';
import { ResponseBuilder } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserWordSenseDto, UpdateUserWordSenseDto } from './dto';
import { UserWordSenseService } from './user-word-sense.service';

@ApiTags(FEATURE_KEY.USER_WORD_SENSE)
@Controller(FEATURE_KEY.USER_WORD_SENSE)
export class UserWordSenseController {
  constructor(private readonly service: UserWordSenseService) {}

  @ApiAuth({
    summary: 'Batch create user word senses',
  })
  @Post()
  async createBatch(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateUserWordSenseDto,
  ) {
    const result = await this.service.createBatch(userId, dto);
    return ResponseBuilder.toList({
      items: result,
      meta: { count: result.length },
    });
  }

  @ApiAuth({
    summary: 'Update user word sense',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateUserWordSenseDto,
  ) {
    const result = await this.service.update(id, userId, dto);
    return ResponseBuilder.toSingle({ data: result });
  }

  @ApiAuth({
    summary: 'Delete user word sense',
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.service.delete(id, userId);
    return ResponseBuilder.toSingle({ data: null });
  }
}

@ApiTags(FEATURE_KEY.TOPIC)
@Controller(FEATURE_KEY.TOPIC)
export class TopicWordSenseController {
  constructor(private readonly service: UserWordSenseService) {}

  @ApiAuth({
    summary: 'List word senses by topic',
  })
  @Get(':topicId/word-senses')
  async findByTopic(
    @Param('topicId') topicId: string,
    @CurrentUser('id') userId: string,
  ) {
    const result = await this.service.findByTopic(topicId, userId);
    return ResponseBuilder.toList({
      items: result,
      meta: { count: result.length },
    });
  }
}
