import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LOOKUP_ERROR_CODES } from './error-codes.constants';

export const LookupNotFound = new NotFoundException({
  message: 'Lookup not found',
  error: LOOKUP_ERROR_CODES.NOT_FOUND,
  statusCode: 404,
});

export const DictionaryProviderError = new InternalServerErrorException({
  message: 'Dictionary provider not found',
  error: LOOKUP_ERROR_CODES.PROVIDER_ERROR,
  statusCode: 500,
});

export class AdapterError extends Error {
  error = LOOKUP_ERROR_CODES.ADAPTER_ERROR;
  constructor(message: string) {
    super(message);
    this.name = 'AdapterError';
  }
}
