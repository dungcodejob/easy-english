import { Public } from '@app/decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ImportService } from '../application/import.service';
import { ImportDto } from './dto/import.dto';

@Controller('dictionary/import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Public()
  @Post()
  async import(@Body() dto: ImportDto) {
    return this.importService.import(dto.keyword, dto.source);
  }
}
