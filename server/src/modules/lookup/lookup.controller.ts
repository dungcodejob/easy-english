import { FEATURE_KEY } from '@app/constants';
import { ApiAuth } from '@app/decorators';
import { DictionarySource, Language } from '@app/entities';
import { ResponseBuilder } from '@app/models';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LookupService } from './lookup.service';

@ApiTags(FEATURE_KEY.LOOKUP)
@Controller(FEATURE_KEY.LOOKUP)
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @ApiAuth({
    auths: ['jwt'],
    summary: 'Lookup a word',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    description: 'Dictionary source (default: dictionary-api)',
  })
  @Get(':word')
  async lookup(@Param('word') word: string) {
    const result = await this.lookupService.lookup(
      word,
      DictionarySource.DICTIONARY_API,
      Language.EN,
    );
    if (!result) {
      // Return 404 via ResponseBuilder or standard exception
      // Assuming ResponseBuilder handles null data as success: false or we need to throw specific error.
      // For now, let's just return it wrapped.
      return ResponseBuilder.toSingle({ data: null });
    }
    return ResponseBuilder.toSingle({ data: result });
  }
}
