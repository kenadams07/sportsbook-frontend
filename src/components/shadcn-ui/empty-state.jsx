import * as React from 'react';
import { cn } from '@/lib/utils';

function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/60 p-6 text-center', className)}>
      {icon && <div className="mb-3 grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">{icon}</div>}
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { EmptyState };
