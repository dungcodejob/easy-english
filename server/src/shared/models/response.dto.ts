import { PaginationMetaDto } from './pagination-meta.dto';

export interface BaseResponseDto {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  url: string;
  method: string;
}

export interface ErrorResponseDto extends BaseResponseDto {
  success: false;
  errorCode: string;
}

export interface SuccessResponseDto<T> extends BaseResponseDto {
  success: true;
  result: T;
}

export type SingleResponseDto<T> = SuccessResponseDto<T>;

export type ListResponseDto<T> = SuccessResponseDto<{
  items: T[];
  meta: { count?: number };
}>;

export type PaginationResponseDto<T> = SuccessResponseDto<{
  items: T[];
  meta: { pagination: PaginationMetaDto };
}>;

export type ValidatorResponseDto = ErrorResponseDto & {
  errorCode: 'VALIDATION_ERROR';
  result: {
    meta: {
      validators: {
        property: string;
        constraints: { [key: string]: string };
      }[];
    };
  };
};
