export const ErrorType = {
  NETWORK: 'NETWORK',
  BACKEND: 'BACKEND',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface NetworkError {
  type: typeof ErrorType.NETWORK;
  statusCode?: number;
  message: string;
  originalError?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  constraint?: string;
}

export interface BackendError {
  type: typeof ErrorType.BACKEND;
  statusCode: number;
  errorCode: string;
  message: string;
  validationErrors?: ValidationError[];
}

export type AppError = NetworkError | BackendError;

// Type guards
export const isNetworkError = (error: AppError): error is NetworkError =>
  error.type === ErrorType.NETWORK;

export const isBackendError = (error: AppError): error is BackendError =>
  error.type === ErrorType.BACKEND;

export const isValidationError = (error: AppError): error is BackendError =>
  isBackendError(error) && error.errorCode === 'App.ValidationError';
