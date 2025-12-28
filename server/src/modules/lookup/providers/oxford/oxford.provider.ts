import { Errors } from '@app/errors';
import { OxfordDictionaryService } from '@app/services/oxford-dictionary.service';
import { Injectable, Logger } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import { NormalizedData } from '../../models/lookup-result.model';
import { DictionaryProvider } from '../dictionary-provider.interface';
import { OxfordAdapter } from './oxford.adapter';

@Injectable()
export class OxfordProvider implements DictionaryProvider {
  name = 'oxford';
  private readonly logger = new Logger(OxfordProvider.name);

  constructor(
    private readonly oxfordService: OxfordDictionaryService,
    private readonly adapter: OxfordAdapter,
  ) {}

  async lookup(word: string): Promise<Result<NormalizedData, Error>> {
    try {
      // 1. Fetch raw data
      // const res = await this.oxfordService.lookupWord(word);

      const res = {} as any;

      if (!res.data) {
        return err(Errors.LookupNotFound);
      }

      // 2. Transform using adapter
      const normalizedData = this.adapter.adapt(res.data);

      if (!normalizedData) {
        return err(Errors.LookupNotFound);
      }

      return ok(normalizedData);
    } catch (error) {
      this.logger.error(
        `Error in OxfordProvider lookup for ${word}: ${error.message}`,
      );
      return err(error);
    }
  }
}
