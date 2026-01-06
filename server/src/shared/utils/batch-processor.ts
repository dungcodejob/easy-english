import { Logger } from '@nestjs/common';

export interface BatchProcessorOptions {
  batchSize: number;
  delayMs: number;
  logger?: Logger;
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process items in batches with delay between batches to avoid API spam.
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item
 * @param options - Batch processing options
 * @returns Array of processed results (null results are filtered out)
 *
 * @example
 * const definitions = await processBatch(
 *   defIds,
 *   (defId) => this.getDefinition(defId),
 *   { batchSize: 3, delayMs: 500, logger: this.logger }
 * );
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R | null>,
  options: BatchProcessorOptions,
): Promise<R[]> {
  const { batchSize, delayMs, logger } = options;
  const results: R[] = [];
  let requestCount = 0;

  for (const item of items) {
    const result = await processor(item);
    if (result !== null) {
      results.push(result);
    }

    requestCount++;

    // Delay after every batchSize requests
    if (requestCount % batchSize === 0 && requestCount < items.length) {
      logger?.debug(
        `Batch ${requestCount / batchSize} completed, delaying ${delayMs}ms...`,
      );
      await delay(delayMs);
    }
  }

  return results;
}
