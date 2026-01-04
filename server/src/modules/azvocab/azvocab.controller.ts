import { Public } from '@app/decorators';
import { ResponseBuilder } from '@app/models';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AzVocabService } from './azvocab.service';
import { ImportDictionaryDto } from './dto/import-vocab.dto';

@ApiTags('AzVocab')
@Controller('azvocab')
export class AzVocabController {
  constructor(private readonly azVocabService: AzVocabService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for a word in azVocab dictionary' })
  @ApiQuery({ name: 'q', description: 'Keyword to search', required: true })
  async search(@Query('q') keyword: string) {
    const data = await this.azVocabService.search(keyword);
    return ResponseBuilder.toSingle({ data });
  }

  @Get('definition')
  @ApiOperation({ summary: 'Get detailed definition by ID' })
  @ApiQuery({ name: 'id', description: 'Definition ID', required: true })
  async getDefinition(@Query('id') defId: string) {
    const data = await this.azVocabService.getDefinition(defId);
    return ResponseBuilder.toSingle({ data });
  }

  @Get('lookup')
  @ApiOperation({
    summary: 'Search and get all detailed definitions for a word',
  })
  @ApiQuery({
    name: 'q',
    description: 'Keyword to lookup',
    required: true,
  })
  async lookup(@Query('q') keyword: string) {
    const data = await this.azVocabService.searchAndGetDefinitions(keyword);
    return ResponseBuilder.toSingle({ data });
  }

  @Public()
  @Post('import-dictionary')
  @ApiOperation({ summary: 'Import dictionary data from azVocab' })
  async importDictionary(@Body() dto: ImportDictionaryDto) {
    const data = await this.azVocabService.importToDictionary(dto);
    return ResponseBuilder.toSingle({ data });
  }
}
