import { Errors } from '@app/errors';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import {
  LookupProvider,
  NormalizedData,
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

  async lookup(word: string): Promise<Result<NormalizedData, Error>> {
    try {
      // 1. Fetch raw data
      const res = await this.httpService.axiosRef.get(
        `${this.baseUrl}/${word}`,
      );

      if (!res.data) {
        return err(Errors.LookupNotFound);
      }

      // 2. Transform using adapter
      const normalized = this.adapter.adapt(res.data);

      if (!normalized) {
        return err(Errors.LookupNotFound);
      }

      return ok(normalized);
    } catch (error) {
      this.logger.error(
        `Error in FreeDictionaryProvider lookup for ${word}: ${error.message}`,
      );
      return err(Errors.DictionaryProviderError);
    }
  }
}
