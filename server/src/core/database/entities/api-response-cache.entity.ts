import { ApiResponseCacheRepository } from '@app/repositories';
import {
  Entity,
  EntityRepositoryType,
  Enum,
  Index,
  JsonType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import { v7 } from 'uuid';
import { BaseEntity } from './base.entity';

export enum ApiProvider {
  AZVOCAB = 'azvocab',
  CAMBRIDGE = 'cambridge',
  FREE_DICTIONARY = 'free_dictionary',
}

export enum ApiEndpointType {
  SEARCH = 'search',
  DEFINITION = 'definition',
}

/**
 * Cache raw API responses for debugging and re-mapping purposes
 */
@Entity({
  tableName: 'api_response_cache',
  repository: () => ApiResponseCacheRepository,
})
@Unique({ properties: ['provider', 'endpointType', 'requestIdentifier'] })
@Index({ properties: ['provider', 'requestIdentifier'] })
export class ApiResponseCacheEntity extends BaseEntity {
  @Enum(() => ApiProvider)
  provider: ApiProvider;

  @Enum(() => ApiEndpointType)
  endpointType: ApiEndpointType;

  /**
   * The lookup key: search term for SEARCH, definition ID for DEFINITION
   */
  @Property({ length: 255 })
  requestIdentifier: string;

  /**
   * Full raw JSON response from the API
   */
  @Property({ type: JsonType })
  rawResponse: unknown;

  /**
   * Response size in bytes (for monitoring)
   */
  @Property({ nullable: true })
  responseSizeBytes?: number;

  /**
   * HTTP status code
   */
  @Property({ default: 200 })
  statusCode: number = 200;

  /**
   * Request latency in milliseconds
   */
  @Property({ nullable: true })
  latencyMs?: number;

  [EntityRepositoryType]?: ApiResponseCacheRepository;

  constructor(data: {
    provider: ApiProvider;
    endpointType: ApiEndpointType;
    requestIdentifier: string;
    rawResponse: unknown;
    responseSizeBytes?: number;
    statusCode?: number;
    latencyMs?: number;
  }) {
    super();
    this.id = v7();
    this.provider = data.provider;
    this.endpointType = data.endpointType;
    this.requestIdentifier = data.requestIdentifier;
    this.rawResponse = data.rawResponse;
    this.responseSizeBytes = data.responseSizeBytes;
    this.statusCode = data.statusCode ?? HttpStatus.OK;
    this.latencyMs = data.latencyMs;
  }
}
