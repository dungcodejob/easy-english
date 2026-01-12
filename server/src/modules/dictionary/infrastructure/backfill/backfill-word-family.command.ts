import { Command, CommandRunner, Option } from 'nest-commander';
import { WordBackfillService } from './word-backfill.service';

interface CommandOptions {
  dryRun?: boolean;
  batchSize?: number;
}

@Command({
  name: 'backfill:word-family',
  description: 'Backfill wordFamily data from cached API responses',
})
export class BackfillWordFamilyCommand extends CommandRunner {
  constructor(private readonly service: WordBackfillService) {
    super();
  }

  async run(inputs: string[], options: CommandOptions): Promise<void> {
    const isDryRun = !!options.dryRun;
    const batchSize = options.batchSize ? Number(options.batchSize) : 100;

    console.log('Running Backfill Word Family...');
    console.log(`Dry Run: ${isDryRun}`);
    console.log(`Batch Size: ${batchSize}`);

    const result = await this.service.backfillWordFamily({
      dryRun: isDryRun,
      batchSize,
    });

    console.log('------------------------------------------------');
    console.log('Backfill Summary:');
    console.log(`Total Processed: ${result.totalProcessed}`);
    console.log(`Updated:         ${result.updatedCount}`);
    console.log(`Skipped:         ${result.skippedCount}`);
    console.log(`Errors:          ${result.errorCount}`);
    console.log('------------------------------------------------');
  }

  @Option({
    flags: '-d, --dry-run',
    description: 'Run simulation without persisting changes',
    required: false,
  })
  parseDryRun(): boolean {
    return true;
  }

  @Option({
    flags: '-b, --batch-size <number>',
    description: 'Number of records to process per batch',
    required: false,
  })
  parseBatchSize(val: string): number {
    return Number(val);
  }
}
