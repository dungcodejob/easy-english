import { WORD_AGGREGATE_REPOSITORY } from '@app/domain/dictionary';
import { Module } from '@nestjs/common';
import { MikroOrmWordRepository } from '../repositories/mikro-orm-word.repository';
import { AzVocabBackfillExtractor } from './azvocab-backfill.extractor';
import { BackfillWordFamilyCommand } from './backfill-word-family.command';
import { WordBackfillService } from './word-backfill.service';

/**
 * Minimal Backfill Module for CLI usage
 * Only includes dependencies required for backfill operations
 */
@Module({
  imports: [],
  providers: [
    {
      provide: WORD_AGGREGATE_REPOSITORY,
      useClass: MikroOrmWordRepository,
    },
    WordBackfillService,
    AzVocabBackfillExtractor,
    BackfillWordFamilyCommand,
    {
      provide: 'WORD_BACKFILL_EXTRACTORS',
      useFactory: (azVocab: AzVocabBackfillExtractor) => [azVocab],
      inject: [AzVocabBackfillExtractor],
    },
  ],
  exports: [WordBackfillService, BackfillWordFamilyCommand],
})
export class BackfillModule {}
