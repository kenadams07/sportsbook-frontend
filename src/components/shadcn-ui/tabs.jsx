import React, { createContext, useContext } from 'react';

import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

function Tabs({ value, onValueChange, children, className, ...props }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div data-slot="tabs" className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        'inline-flex min-h-10 items-center gap-1 rounded-md border border-border bg-muted/45 p-1',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ value, className, ...props }) {
  const context = useContext(TabsContext);
  const selected = context?.value === value;

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      data-state={selected ? 'active' : 'inactive'}
      aria-selected={selected}
      onClick={() => context?.onValueChange?.(value)}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded px-3 text-sm font-medium outline-none transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:translate-y-px',
        selected
          ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
          : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ value, className, ...props }) {
  const context = useContext(TabsContext);

  if (context?.value !== value) {
    return null;
  }

  return (
    <div
      data-slot="tabs-content"
      className={cn('mt-4 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
