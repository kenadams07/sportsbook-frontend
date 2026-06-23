import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function Checkbox({ checked, onCheckedChange, className, 'aria-label': ariaLabel, ...props }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={Boolean(checked)}
      aria-label={ariaLabel}
      data-state={checked ? 'checked' : 'unchecked'}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-[5px] border-2 border-[#283A55]/55 bg-white p-0 text-white leading-none shadow-[inset_0_0_0_1px_rgba(40,58,85,0.08),0_1px_2px_rgba(15,23,42,0.08)] outline-none ring-1 ring-[#283A55]/10 transition-all duration-150 hover:border-[#283A55]/80 hover:bg-[#283A55]/5 focus-visible:border-[#1f2f47] focus-visible:ring-2 focus-visible:ring-[#283A55]/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[#1f2f47] data-[state=checked]:bg-[#283A55] data-[state=checked]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),0_2px_5px_rgba(40,58,85,0.22)]',
        className
      )}
      {...props}
    >
      {checked && <Check className="block size-3.5 shrink-0 stroke-[3]" aria-hidden="true" />}
    </button>
  );
}

export { Checkbox };
