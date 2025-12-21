import { ApiAuth } from '@app/decorators';
import { ResponseBuilder } from '@app/models';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LookupService } from './lookup.service';

@ApiTags('lookup')
@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @ApiAuth({
    auths: ['jwt'],
    summary: 'Lookup a word',
  })
  @ApiQuery({
    name: 'source',
    required: false,
    description: 'Dictionary source (default: oxford)',
  })
  @Get(':word')
  async lookup(@Param('word') word: string, @Query('source') source?: string) {
    const result = await this.lookupService.lookup(word, source);
    return ResponseBuilder.toSingle({ data: result });
  }
}
