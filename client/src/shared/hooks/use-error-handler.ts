
import { toast } from '@/shared/utils/toast';
import { useCallback } from 'react';
import type { AppError } from '../lib/errors/app-error';
import { isBackendError, isNetworkError, isValidationError } from '../lib/errors/app-error';

export function useErrorHandler() {
  const handleError = useCallback((error: AppError) => {
    if (isNetworkError(error)) {
      toast.error('Network Error', {
        description: error.message,
      });
      return;
    }

    if (isBackendError(error)) {
      // Don't show toast for validation errors (handled by form)
      if (isValidationError(error)) {
        return;
      }

      // Show backend error
      toast.error('Error', {
        description: (error as any).message,
      });
    }
  }, []);

  return { handleError };
}
