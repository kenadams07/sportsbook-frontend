import { ChevronDown } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn-ui/collapsible';
import { cn } from '@/lib/utils';

function Accordion({ children, className, ...props }) {
  return (
    <div data-slot="accordion" className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
}

function AccordionItem({ open, onOpenChange, children, className, ...props }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div
        data-slot="accordion-item"
        className={cn('overflow-hidden rounded-lg border border-border bg-background', className)}
        {...props}
      >
        {children}
      </div>
    </Collapsible>
  );
}

function AccordionTrigger({ children, className, ...props }) {
  return (
    <CollapsibleTrigger
      data-slot="accordion-trigger"
      className={cn(
        'group flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left outline-none transition-colors duration-150 ease-out hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring/45',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-aria-expanded:rotate-180" />
    </CollapsibleTrigger>
  );
}

function AccordionContent({ children, className, ...props }) {
  return (
    <CollapsibleContent
      data-slot="accordion-content"
      className={cn('border-t border-border bg-muted/20', className)}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
