import { Module } from '@nestjs/common';
import { ImportService } from './application/import.service';
import { LookupService } from './application/lookup.service';
import { DictionaryInfrastructureModule } from './infrastructure/dictionary-infrastructure.module';
import { DictionaryController } from './presentation/dictionary.controller';

@Module({
  imports: [DictionaryInfrastructureModule],
  controllers: [DictionaryController],
  providers: [ImportService, LookupService],
  exports: [ImportService, LookupService],
})
export class DictionaryModule {}
