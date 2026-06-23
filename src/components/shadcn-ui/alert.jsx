import * as React from 'react';
import { cn } from '@/lib/utils';

function Alert({ className, variant = 'default', ...props }) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(
        'rounded-lg border p-3 text-sm',
        variant === 'destructive'
          ? 'border-destructive/40 bg-destructive/10 text-destructive'
          : 'border-border bg-card text-card-foreground',
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return <div data-slot="alert-title" className={cn('mb-1 font-semibold leading-none', className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
  return <div data-slot="alert-description" className={cn('text-sm opacity-90', className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
