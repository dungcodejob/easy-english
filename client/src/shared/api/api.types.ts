import type { ValidationError } from '../lib/errors/app-error';

export interface SuccessResponseDto<T> {
  success: true;
  statusCode: number;
  message?: string;
  result: T;
  meta?: Record<string, any>;
}

export interface ErrorResponseDto {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  result?: {
    meta?: {
      validators?: ValidationError[];
    };
  };
}

export type ApiResponse<T> = SuccessResponseDto<T> | ErrorResponseDto;

// Re-export ValidationError for convenience if needed
export type { ValidationError };

