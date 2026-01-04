import { Module } from '@nestjs/common';
import { ImportService } from './application/import.service';
import { LookupService } from './application/lookup.service';
import { DictionaryInfrastructureModule } from './infrastructure/dictionary-infrastructure.module';
import { ImportController } from './presentation/import.controller';
import { LookupController } from './presentation/lookup.controller';

@Module({
  imports: [DictionaryInfrastructureModule],
  controllers: [ImportController, LookupController],
  providers: [ImportService, LookupService],
  exports: [ImportService, LookupService],
})
export class DictionaryModule {}
