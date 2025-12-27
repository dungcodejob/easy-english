import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import React from 'react';

export interface ConfirmationDialogProps {
  // Core dialog controls
  open: boolean;
  onOpenChange?: (open: boolean) => void;

  // Content customization
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode; // For custom content

  // Action buttons
  confirmLabel?: string; // Default: "Confirm"
  cancelLabel?: string; // Default: "Cancel"

  // Styling & Variants
  variant?: 'destructive' | 'default' | 'warning' | 'info';
  confirmClassName?: string; // Override confirm button styles

  // Callbacks
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;

  // Advanced features
  isLoading?: boolean; // Show loading state
  disabled?: boolean; // Disable confirm button
  hideCancel?: boolean; // Hide cancel button
}

const variantStyles = {
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  warning: 'bg-orange-600 text-white hover:bg-orange-700',
  info: 'bg-blue-600 text-white hover:bg-blue-700',
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  confirmClassName,
  onConfirm,
  onCancel,
  isLoading = false,
  disabled = false,
  hideCancel = false,
}: ConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirm = async () => {
    if (!onConfirm || isProcessing || disabled) return;

    try {
      setIsProcessing(true);
      const result = onConfirm();

      // Handle both sync and async callbacks
      if (result instanceof Promise) {
        await result;
      }

      // Auto-close dialog after successful confirmation
      // Only if onOpenChange is provided (controlled mode)
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      // Error handling - dialog stays open
      console.error('Confirmation action failed:', error);
      // Optionally re-throw or handle error
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Auto-close on cancel
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const isButtonDisabled = isLoading || isProcessing || disabled;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {/* Custom content area */}
        {children && <div className="py-4">{children}</div>}

        <AlertDialogFooter>
          {!hideCancel && (
            <AlertDialogCancel onClick={handleCancel} disabled={isButtonDisabled}>
              {cancelLabel}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isButtonDisabled}
          
          >
            {isButtonDisabled ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
