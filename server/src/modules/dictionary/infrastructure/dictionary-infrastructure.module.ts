import { WORD_AGGREGATE_REPOSITORY } from '@app/domain/dictionary';
import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ImportProviderFactory } from './import/import-provider.factory';
import { AzVocabProvider } from './import/providers/azvocab/azvocab.provider';
import { LookupProviderFactory } from './lookup/lookup-provider.factory';
import { FreeDictionaryAdapter } from './lookup/providers/free-dictionary/free-dictionary.adapter';
import { FreeDictionaryProvider } from './lookup/providers/free-dictionary/free-dictionary.provider';
import { OxfordAdapter } from './lookup/providers/oxford/oxford.adapter';
import { OxfordProvider } from './lookup/providers/oxford/oxford.provider';
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
    // Import providers
    AzVocabProvider,
    ImportProviderFactory,
    // Lookup providers
    LookupProviderFactory,
    OxfordProvider,
    FreeDictionaryProvider,
    OxfordAdapter,
    FreeDictionaryAdapter,
    OxfordDictionaryService,
  ],
  exports: [
    WORD_AGGREGATE_REPOSITORY,
    AzVocabProvider,
    ImportProviderFactory,
    LookupProviderFactory,
  ],
})
export class DictionaryInfrastructureModule {}
