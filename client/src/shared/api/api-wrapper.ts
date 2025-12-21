import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { err, ok, type Result } from 'neverthrow';
import type { AppError } from '../lib/errors/app-error';
import { ErrorType } from '../lib/errors/app-error';
import type { ApiResponse, ErrorResponseDto } from './api.types';

export async function apiCall<T>(
  apiFunction: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<Result<T, AppError>> {
  try {
    const response = await apiFunction();
    const data = response.data;

    // Backend returned success: false (business error)
    if (!data.success) {
      const errorData = data as ErrorResponseDto;
      return err({
        type: ErrorType.BACKEND,
        statusCode: errorData.statusCode,
        errorCode: errorData.errorCode,
        message: errorData.message,
        validationErrors: errorData.result?.meta?.validators,
      });
    }

    // Backend returned success: true
    return ok(data.result);
  } catch (error) {
    // Network / HTTP error
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponseDto>;

      // Server responded with error status (4xx, 5xx)
      if (axiosError.response) {
        const responseData = axiosError.response.data;

        // If backend sent structured error
        if (responseData && 'success' in responseData && !responseData.success) {
          return err({
            type: ErrorType.BACKEND,
            statusCode: responseData.statusCode,
            errorCode: responseData.errorCode,
            message: responseData.message,
            validationErrors: responseData.result?.meta?.validators,
          });
        }

        // Generic HTTP error
        return err({
          type: ErrorType.NETWORK,
          statusCode: axiosError.response.status,
          message: axiosError.message || 'An unexpected error occurred',
          originalError: error,
        });
      }

      // Network error (no response)
      if (axiosError.request) {
        return err({
          type: ErrorType.NETWORK,
          message: 'Network error. Please check your connection.',
          originalError: error,
        });
      }
    }

    // Unknown error
    return err({
      type: ErrorType.NETWORK,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      originalError: error,
    });
  }
}
