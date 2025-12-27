import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LookupController } from './lookup.controller';
import { LookupService } from './lookup.service';

import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { DictionaryProviderFactory } from './providers/dictionary-provider.factory';
import { FreeDictionaryAdapter } from './providers/free-dictionary/free-dictionary.adapter';
import { FreeDictionaryProvider } from './providers/free-dictionary/free-dictionary.provider';
import { OxfordAdapter } from './providers/oxford/oxford.adapter';
import { OxfordProvider } from './providers/oxford/oxford.provider';

@Module({
  imports: [HttpModule],
  controllers: [LookupController],
  providers: [
    LookupService,
    DictionaryProviderFactory,
    // Adapters
    OxfordAdapter,
    FreeDictionaryAdapter,
    // Providers
    OxfordProvider,
    FreeDictionaryProvider,
    // External Services
    OxfordDictionaryService,
  ],
  exports: [LookupService],
})
export class LookupModule {}
