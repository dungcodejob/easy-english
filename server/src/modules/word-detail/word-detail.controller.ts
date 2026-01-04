import { Public } from '@app/decorators';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordDetailResponseDto } from './dto/word-detail-response.dto';
import { WordDetailService } from './word-detail.service';

@ApiTags('Word Detail')
@Controller('word-detail')
export class WordDetailController {
  constructor(private readonly service: WordDetailService) {}

  @Public()
  @Get(':keyword')
  @ApiOperation({ summary: 'Get detailed information for a word' })
  @ApiOkResponse({ type: WordDetailResponseDto })
  getWordDetail(
    @Param('keyword') keyword: string,
  ): Promise<WordDetailResponseDto> {
    return this.service.getWordDetail(keyword);
  }
}
