import { useEffect } from 'react';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { AppError } from '../lib/errors/app-error';
import { isValidationError } from '../lib/errors/app-error';

export function useValidationErrors<T extends FieldValues>(
  error: AppError | null | undefined,
  setError: UseFormSetError<T>
) {
  useEffect(() => {
    if (!error || !isValidationError(error)) {
      return;
    }

    const validationErrors = error.validationErrors || [];

    validationErrors.forEach((validationError) => {
      setError(validationError.field as Path<T>, {
        type: 'server',
        message: validationError.message,
      });
    });
  }, [error, setError]);
}
