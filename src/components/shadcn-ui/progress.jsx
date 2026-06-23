import * as React from 'react';
import { cn } from '@/lib/utils';

function Progress({ value = 0, className, ...props }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn('h-2 overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      <div
        className="h-full bg-primary transition-transform duration-200 ease-out"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  );
}

export { Progress };
