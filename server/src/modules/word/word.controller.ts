import { FEATURE_KEY } from '@app/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CreateWordDto, UpdateWordDto } from './models';
import { WordService } from './word.service';

// Assuming AuthGuard is available globally or we use it here.
// Skipping guards in import if globally applied, but good to check.
// I'll assume usage of standard decorators.

@Controller(`${FEATURE_KEY.TOPIC}/:topicId/${FEATURE_KEY.WORD}`)
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  create(
    @Param('topicId') topicId: string,
    @Body() dto: CreateWordDto,
    @Req() req: any,
  ) {
    // req.user.id usually available if auth guard is used
    return this.wordService.create(topicId, req.user?.id as string, dto);
  }

  @Post('oxford')
  createFromOxford(
    @Param('topicId') topicId: string,
    @Body('word') word: string,
    @Req() req: any,
  ) {
    return this.wordService.createFromOxford(
      topicId,
      req.user?.id as string,
      word,
    );
  }

  @Get()
  findAll(@Param('topicId') topicId: string, @Query() query: any) {
    return this.wordService.findAll(topicId, query);
  }
}

// Separate controller for /words/:id or include here?
// Usually nested routes are for collections. /words/:id for single item.
// Let's create another controller class or method for single word.
// NestJS allows multiple controllers or multiple paths.

@Controller(`${FEATURE_KEY.WORD}/:id`)
export class SingleWordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWordDto) {
    return this.wordService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordService.delete(id);
  }
}
