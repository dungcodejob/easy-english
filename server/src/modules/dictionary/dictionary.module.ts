import { Module } from '@nestjs/common';
import { ImportService } from './application/import.service';
import { LookupService } from './application/lookup.service';
import { WordDetailService } from './application/word-detail.service';
import { DictionaryInfrastructureModule } from './infrastructure/dictionary-infrastructure.module';
import { DictionaryController } from './presentation/dictionary.controller';

@Module({
  imports: [DictionaryInfrastructureModule],
  controllers: [DictionaryController],
  providers: [ImportService, LookupService, WordDetailService],
  exports: [ImportService, LookupService, WordDetailService],
})
export class DictionaryModule {}
