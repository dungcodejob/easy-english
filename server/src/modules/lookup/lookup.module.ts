import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { Module } from '@nestjs/common';
import { OxfordAdapter } from './adapters/oxford.adapter';
import { DictionaryProviderFactory } from './factories/dictionary-provider.factory';
import { LookupController } from './lookup.controller';
import { LookupService } from './lookup.service';
import { OxfordProvider } from './providers/oxford.provider';

@Module({
  controllers: [LookupController],
  providers: [
    LookupService,
    DictionaryProviderFactory,
    // Adapters
    OxfordAdapter,
    // Providers
    OxfordProvider,
    // External Services (if not already global or provided by SharedModule)
    // OxfordDictionaryService is provided in SharedModule? Let's assume it needs to be imported or provided.
    // Ideally it should be part of a Shared or Core module exported globally.
    // If not global, we might need to add it here or import the module that exports it.
    // Let's assume we use it as a provider here for now or it's global.
    // Checking app.module might clarify. It's not in exports of any visible module in file list.
    // For safety, we add it to providers if it's not global, or if it is Injectable.
    // But better to check. Assuming it is available via dependency injection.
    OxfordDictionaryService,
  ],
})
export class LookupModule {}
