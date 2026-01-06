// Re-export shared domain base classes for convenience
export * from '@app/domain';
export * from './events';
export * from './import';
export * from './models';
export { WORD_AGGREGATE_REPOSITORY } from './repositories/word-aggregate.repository.interface';
export type { IWordAggregateRepository } from './repositories/word-aggregate.repository.interface';
export * from './services';
