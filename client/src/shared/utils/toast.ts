import type React from 'react';
import { toast as sonnerToast, type ExternalToast } from 'sonner';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

type ToastOptions = ExternalToast & {
  variant?: ToastVariant;
};

/**
 * Custom types for promise-based toasts
 */
type PromiseT<T> = Promise<T> | (() => Promise<T>);

type PromiseData<T = any> = {
  loading?: string | React.ReactNode;
  success?: string | React.ReactNode | ((data: T) => React.ReactNode | string);
  error?: string | React.ReactNode | ((error: any) => React.ReactNode | string);
  description?: string | React.ReactNode | ((data: any) => React.ReactNode | string);
  finally?: () => void | Promise<void>;
};

/**
 * Get custom styles for toast variants
 */
const getStyleForVariant = (variant: ToastVariant): React.CSSProperties => {
  const styles: Record<ToastVariant, React.CSSProperties> = {
    success: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
      '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
      '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))',
    } as React.CSSProperties,
    error: {
      '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
      '--normal-text': 'var(--destructive)',
      '--normal-border': 'var(--destructive)',
    } as React.CSSProperties,
    warning: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
      '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
      '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
    } as React.CSSProperties,
    info: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))',
      '--normal-text': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
      '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    } as React.CSSProperties,
    default: {} as React.CSSProperties,
  };

  return styles[variant];
};

/**
 * Merge variant styles with custom styles from options
 */
const mergeStyles = (variant: ToastVariant, customStyle?: React.CSSProperties): React.CSSProperties => {
  return { ...getStyleForVariant(variant), ...customStyle } as React.CSSProperties;
};

/**
 * Custom toast utility with variant-based styling
 * 
 * @example
 * ```ts
 * toast.success('Operation completed!');
 * toast.error('Something went wrong');
 * toast.warning('Please check your input');
 * toast.info('New update available');
 * 
 * // With custom options
 * toast.success('Saved!', { duration: 5000, position: 'top-right' });
 * 
 * // Using toast.promise
 * toast.promise(
 *   fetchData(),
 *   {
 *     loading: 'Loading...',
 *     success: 'Data loaded',
 *     error: 'Failed to load'
 *   }
 * );
 * ```
 */
export const toast = {
  /**
   * Display a success toast
   */
  success: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'success', style, ...rest } = options || {};
    return sonnerToast.success(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display an error toast
   */
  error: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'error', style, ...rest } = options || {};
    return sonnerToast.error(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display a warning toast
   */
  warning: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'warning', style, ...rest } = options || {};
    return sonnerToast.warning(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display an info toast
   */
  info: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'info', style, ...rest } = options || {};
    return sonnerToast.info(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display a loading toast
   */
  loading: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'default', style, ...rest } = options || {};
    return sonnerToast.loading(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display a custom toast with default styling
   */
  message: (message: string | React.ReactNode, options?: ToastOptions) => {
    const { variant = 'default', style, ...rest } = options || {};
    return sonnerToast(message, {
      ...rest,
      style: mergeStyles(variant, style),
    });
  },

  /**
   * Display a custom toast component
   */
  custom: sonnerToast.custom,

  /**
   * Promise-based toast for async operations with custom styling
   * 
   * Note: Vì Sonner's toast.promise không hỗ trợ styling per state,
   * chúng ta sử dụng approach thủ công để có full control
   * 
   * @example
   * ```ts
   * // Basic usage
   * toast.promise(
   *   fetchData(),
   *   {
   *     loading: 'Loading data...',
   *     success: (data) => `Loaded ${data.length} items`,
   *     error: (err) => `Error: ${err.message}`,
   *   }
   * );
   * ```
   */
  promise: async <T>(
    promiseOrFn: PromiseT<T>,
    messages?: PromiseData<T>
  ): Promise<T> => {
    // Resolve promise nếu là function
    const promise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
    
    // Show loading toast
    const loadingToastId = toast.loading(
      messages?.loading || 'Loading...'
    );

    try {
      // Wait for promise to resolve
      const data = await promise;
      
      // Dismiss loading toast
      sonnerToast.dismiss(loadingToastId);
      
      // Show success toast với custom styling
      const successMessage = typeof messages?.success === 'function' 
        ? messages.success(data) 
        : messages?.success || 'Success';
      
      toast.success(successMessage);
      
      // Call finally callback if provided
      if (messages?.finally) {
        await messages.finally();
      }
      
      return data;
    } catch (error) {
      // Dismiss loading toast
      sonnerToast.dismiss(loadingToastId);
      
      // Show error toast với custom styling
      const errorMessage = typeof messages?.error === 'function'
        ? messages.error(error)
        : messages?.error || 'An error occurred';
      
      toast.error(errorMessage);
      
      // Call finally callback if provided
      if (messages?.finally) {
        await messages.finally();
      }
      
      throw error;
    }
  },

  /**
   * Dismiss a toast by ID
   */
  dismiss: sonnerToast.dismiss,

  /**
   * Get a toast by ID (for advanced use cases)
   */
  getHistory: sonnerToast.getHistory,
};

/**
 * Re-export types for external use
 */
export type { ToastOptions, ToastVariant };

