import { ApiAuth, Public } from '@app/decorators';
import { DictionarySource, Language } from '@app/entities';
import { ResponseBuilder } from '@app/models';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ImportService } from '../application/import.service';
import { LookupService } from '../application/lookup.service';
import { ImportDto } from './dto/import.dto';

@ApiTags('dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(
    private readonly lookupService: LookupService,
    private readonly importService: ImportService,
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
      source || DictionarySource.DICTIONARY_API,
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
}
