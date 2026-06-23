import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Pin, PinOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn-ui/tooltip'
import { NavBadge } from '@/components/sidebar/NavBadge'
import { fadeSlide } from '@/components/sidebar/motion'

/**
 * A single leaf navigation row. Used both at the top level and inside
 * submenus / flyouts. Renders icons-only with a tooltip when `collapsed`.
 */
export function NavLeaf({
  item,
  collapsed = false,
  nested = false,
  onNavigate,
  showPin = true,
  pinned = false,
  onTogglePin,
}) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group/navleaf relative flex items-center gap-3 rounded-md text-sm font-medium outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          collapsed ? 'h-10 w-10 justify-center' : 'h-9 px-3',
          nested && !collapsed && 'h-8 text-[0.8125rem]',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* active rail indicator */}
          {isActive && !collapsed && (
            <motion.span
              layoutId={nested ? undefined : 'active-rail'}
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary"
              aria-hidden="true"
            />
          )}
          {Icon ? (
            <Icon className="size-[1.125rem] shrink-0" aria-hidden="true" />
          ) : (
            !collapsed && (
              <span
                className={cn(
                  'ml-1 size-1.5 shrink-0 rounded-full transition-colors',
                  isActive ? 'bg-sidebar-primary' : 'bg-sidebar-foreground/30',
                )}
                aria-hidden="true"
              />
            )
          )}

          {collapsed && item.badge && <NavBadge badge={item.badge} dot />}

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span {...fadeSlide} className="flex flex-1 items-center gap-2 truncate">
                <span className="truncate">{item.label}</span>
                {item.badge && <NavBadge badge={item.badge} className="ml-auto" />}
              </motion.span>
            )}
          </AnimatePresence>

          {!collapsed && showPin && onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onTogglePin(item.id)
              }}
              aria-label={pinned ? `Unpin ${item.label}` : `Pin ${item.label}`}
              aria-pressed={pinned}
              className={cn(
                'ml-1 grid size-6 shrink-0 place-items-center rounded text-sidebar-foreground/50 outline-none transition',
                'hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                pinned ? 'opacity-100 text-sidebar-primary' : 'opacity-0 group-hover/navleaf:opacity-100 focus-visible:opacity-100',
              )}
            >
              {pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
            </button>
          )}
        </>
      )}
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right" className="flex items-center gap-2">
        {item.label}
        {item.badge && <NavBadge badge={item.badge} />}
      </TooltipContent>
    </Tooltip>
  )
}
