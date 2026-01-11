import { ApiAuth, Public } from '@app/decorators';
import { DictionarySource, Language } from '@app/entities';
import { ResponseBuilder } from '@app/models';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ImportService } from '../application/import.service';
import { LookupService } from '../application/lookup.service';
import { WordDetailService } from '../application/word-detail.service';
import { ImportDto } from './dto/import.dto';
import { WordDetailResponseDto } from './dto/word-detail-response.dto';

@ApiTags('dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly lookupService: LookupService,
    private readonly importService: ImportService,
    private readonly wordDetailService: WordDetailService,
  ) {}

  /**
   * Lookup a word from external dictionary API
   */
  @ApiAuth({
    auths: ['jwt'],
    summary: 'Lookup a word',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    enum: DictionarySource,
    description: 'Dictionary source (default: DICTIONARY_API)',
  })
  @Get('lookup/:word')
  async lookup(
    @Param('word') word: string,
    @Query('source') source?: DictionarySource,
  ) {
    const result = await this.lookupService.lookup(
      word,
      source || DictionarySource.AZVOCAB,
      Language.EN,
    );
    if (!result) {
      return ResponseBuilder.toSingle({ data: null });
    }
    return ResponseBuilder.toSingle({ data: result });
  }

  /**
   * Import words from external source (batch)
   */
  @Public()
  @Post('import')
  async import(@Body() dto: ImportDto) {
    return this.importService.import(dto.keyword, dto.source);
  }

  /**
   * Get detailed information for a word from database
   */

  @Get('word/:keyword')
  @ApiOperation({
    summary: 'Get detailed information for a word from database',
  })
  @ApiOkResponse({ type: WordDetailResponseDto })
  getWordDetail(
    @Param('keyword') keyword: string,
  ): Promise<WordDetailResponseDto> {
    return this.wordDetailService.getWordDetail(keyword);
  }
}
