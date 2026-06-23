import { cn } from '@/lib/utils'

const toneStyles = {
  default: 'bg-sidebar-accent text-sidebar-accent-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-destructive/15 text-destructive',
}

/**
 * Compact notification badge. `dot` renders a tiny indicator for the collapsed
 * rail where there's no room for the full label.
 */
export function NavBadge({ badge, dot = false, className }) {
  if (!badge) return null
  const tone = toneStyles[badge.tone] ?? toneStyles.default

  if (dot) {
    return (
      <span
        className={cn(
          'absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-sidebar-solid',
          badge.tone === 'success' && 'bg-success',
          badge.tone === 'warning' && 'bg-warning',
          badge.tone === 'error' && 'bg-destructive',
          (!badge.tone || badge.tone === 'default') && 'bg-sidebar-primary',
          className,
        )}
        aria-hidden="true"
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.6875rem] font-semibold tabular-nums leading-none',
        tone,
        className,
      )}
    >
      {badge.value}
    </span>
  )
}
