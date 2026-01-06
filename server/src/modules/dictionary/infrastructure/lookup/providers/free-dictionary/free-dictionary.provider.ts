import { Errors } from '@app/errors';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import {
  LookupProvider,
  LookupResult,
} from '../../../../domain/lookup/lookup-provider.interface';
import { FreeDictionaryAdapter } from './free-dictionary.adapter';

@Injectable()
export class FreeDictionaryProvider implements LookupProvider {
  name = 'dictionaryapi';
  private readonly logger = new Logger(FreeDictionaryProvider.name);
  private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  constructor(
    private readonly httpService: HttpService,
    private readonly adapter: FreeDictionaryAdapter,
  ) {}

  async lookup(word: string): Promise<Result<LookupResult, Error>> {
    try {
      // 1. Fetch raw data
      const res = await this.httpService.axiosRef.get(
        `${this.baseUrl}/${word}`,
      );

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
        `Error in FreeDictionaryProvider lookup for ${word}: ${error.message}`,
      );
      return err(Errors.DictionaryProviderError);
    }
  }
}
