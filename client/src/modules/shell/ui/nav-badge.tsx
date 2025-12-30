import { cn } from '@/shared/utils';

interface NavBadgeProps {
  count?: number;
  className?: string;
  variant?: 'default' | 'destructive';
}

export function NavBadge({ count, className, variant = 'default' }: NavBadgeProps) {
  if (!count) return null;

  return (
    <span
      className={cn(
        'ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-medium transition-all group-data-[collapsible=icon]:hidden',
        variant === 'default' && 'bg-primary/10 text-primary',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
