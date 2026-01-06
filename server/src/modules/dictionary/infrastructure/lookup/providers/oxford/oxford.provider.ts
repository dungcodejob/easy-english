import { Errors } from '@app/errors';
import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { Injectable, Logger } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import {
  LookupProvider,
  LookupResult,
} from '../../../../domain/lookup/lookup-provider.interface';
import { OxfordAdapter } from './oxford.adapter';

@Injectable()
export class OxfordProvider implements LookupProvider {
  name = 'oxford';
  private readonly logger = new Logger(OxfordProvider.name);

  constructor(
    private readonly oxfordService: OxfordDictionaryService,
    private readonly adapter: OxfordAdapter,
  ) {}

  async lookup(word: string): Promise<Result<LookupResult, Error>> {
    try {
      // 1. Fetch raw data
      // const res = await this.oxfordService.lookupWord(word);
      const res = {} as { data?: unknown };

      if (!res.data) {
        return err(Errors.LookupNotFound);
      }

      // 2. Transform to Word domain
      const wordDomain = this.adapter.toWordDomain(res.data);

      if (!wordDomain) {
        return err(Errors.LookupNotFound);
      }

      return ok({
        word: wordDomain,
        rawData: res.data,
      });
    } catch (error) {
      this.logger.error(
        `Error in OxfordProvider lookup for ${word}: ${error.message}`,
      );
      return err(error);
    }
  }
}
