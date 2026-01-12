import { WORD_AGGREGATE_REPOSITORY } from '@app/domain/dictionary';
import { EVENT_PUBLISHER } from '@app/domain/dictionary/services';
import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { InMemoryEventPublisher } from './events/in-memory-event-publisher';
import { ImportProviderFactory } from './import/import-provider.factory';
import { LookupProviderFactory } from './lookup/lookup-provider.factory';
import { FreeDictionaryAdapter } from './lookup/providers/free-dictionary/free-dictionary.adapter';
import { FreeDictionaryProvider } from './lookup/providers/free-dictionary/free-dictionary.provider';
import { OxfordAdapter } from './lookup/providers/oxford/oxford.adapter';
import { OxfordProvider } from './lookup/providers/oxford/oxford.provider';
import { AzVocabAdapter } from './providers/azvocab/azvocab.adapter';
import { AzVocabHttpClient } from './providers/azvocab/azvocab.http-client';
import { AzVocabProvider } from './providers/azvocab/azvocab.provider';
import { MikroOrmWordRepository } from './repositories/mikro-orm-word.repository';

/**
 * Dictionary Infrastructure Module
 *
 * Provides the MikroORM implementation of the Word Aggregate Repository
 * and all dictionary providers (import + lookup).
 */
@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: WORD_AGGREGATE_REPOSITORY,
      useClass: MikroOrmWordRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: InMemoryEventPublisher,
    },
    // Unified AzVocab Provider (used by both import and lookup)
    AzVocabProvider,
    AzVocabAdapter,
    AzVocabHttpClient,
    // Factories
    ImportProviderFactory,
    LookupProviderFactory,
    // Other Lookup providers
    OxfordProvider,
    FreeDictionaryProvider,
    OxfordAdapter,
    FreeDictionaryAdapter,
    OxfordDictionaryService,
  ],
  exports: [
    WORD_AGGREGATE_REPOSITORY,
    EVENT_PUBLISHER,
    AzVocabProvider,
    ImportProviderFactory,
    LookupProviderFactory,
  ],
})
export class DictionaryInfrastructureModule {}
