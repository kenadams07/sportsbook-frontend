import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, PanelLeftClose, PanelLeftOpen, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/shadcn-ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn-ui/tooltip'
import { Separator } from '@/components/shadcn-ui/separator'
import { navigation as defaultNav, flattenRoutes } from '@/components/sidebar/menu'
import { filterByRole } from '@/hooks/useSidebar'
import { NavGroup } from '@/components/sidebar/NavGroup'
import { NavLeaf } from '@/components/sidebar/NavLeaf'
import { SidebarSearch } from '@/components/sidebar/SidebarSearch'
import { fadeSlide } from '@/components/sidebar/motion'

/**
 * The shared sidebar content used by both the desktop rail and the mobile
 * drawer. `collapsed` only applies on desktop; the mobile drawer always renders
 * the full expanded layout.
 */
export function SidebarBody({
  sidebar,
  user,
  role,
  onLogout,
  onNavigate,
  showCollapseToggle = true,
}) {
  const { collapsed, expanded, toggleExpanded, isPinned, togglePinned, pinned, toggleCollapsed } =
    sidebar

  const items = useMemo(() => filterByRole(defaultNav, role), [role])
  const displayName = user?.name || user?.username || user?.email || 'Admin User'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Resolve pinned ids into renderable leaf entries.
  const pinnedItems = useMemo(() => {
    const flat = flattenRoutes(items)
    return pinned.map((id) => flat.find((r) => r.id === id)).filter(Boolean)
  }, [items, pinned])

  return (
    <div className="flex h-full flex-col">
      {/* Header / brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-3',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <span className="text-sm font-bold tracking-tight">SB</span>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div {...fadeSlide} className="min-w-0 flex-1">
              {/* <p className="truncate text-sm font-semibold text-sidebar-foreground">
                Sportsbook Ops
              </p> */}
              <p className="truncate text-sm p-2 text-sidebar-foreground/55 font-bold ">Operations Console</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showCollapseToggle && !collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            className="grid size-8 shrink-0 place-items-center rounded-md text-sidebar-foreground/60 outline-none transition hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <PanelLeftClose className="size-[1.125rem]" />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {showCollapseToggle && collapsed && (
        <div className="flex justify-center py-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label="Expand sidebar"
                  className="grid size-10 place-items-center rounded-md text-sidebar-foreground/70 outline-none transition hover:bg-sidebar-accent/50 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                />
              }
            >
              <PanelLeftOpen className="size-[1.125rem]" />
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Search (expanded only) */}
      {!collapsed && (
        <div className="py-3">
          <SidebarSearch navigation={items} onNavigate={onNavigate} />
        </div>
      )}

      {/* Pinned / favorites */}
      {pinnedItems.length > 0 && (
        <div className={cn('px-3 pb-2', collapsed && 'px-2')}>
          {!collapsed && (
            <div className="flex items-center gap-1.5 px-1 pb-1.5 text-xs font-semibold text-sidebar-foreground/50">
              <Star className="size-3.5" aria-hidden="true" />
              Pinned
            </div>
          )}
          <ul className={cn('flex flex-col gap-0.5', collapsed && 'items-center')}>
            {pinnedItems.map((item) => (
              <li key={`pin-${item.id}`}>
                <NavLeaf
                  item={item}
                  collapsed={collapsed}
                  nested={!collapsed}
                  onNavigate={onNavigate}
                  pinned={isPinned(item.id)}
                  onTogglePin={togglePinned}
                />
              </li>
            ))}
          </ul>
          <Separator className="mt-2 bg-sidebar-border" />
        </div>
      )}

      {/* Main navigation — independently scrollable */}
      <ScrollArea className="min-h-0 flex-1">
        <nav
          aria-label="Primary"
          className={cn('flex flex-col gap-0.5 px-3 pb-4', collapsed && 'items-center px-2')}
        >
          {items.map((item) =>
            item.items?.length ? (
              <NavGroup
                key={item.id}
                item={item}
                collapsed={collapsed}
                expanded={expanded[item.id]}
                onToggleExpanded={toggleExpanded}
                onNavigate={onNavigate}
                isPinned={isPinned}
                onTogglePin={togglePinned}
              />
            ) : (
              <NavLeaf
                key={item.id}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
                pinned={isPinned(item.id)}
                onTogglePin={togglePinned}
              />
            ),
          )}
        </nav>
      </ScrollArea>

      {/* Footer / account + logout */}
      <div className={cn('shrink-0 border-t border-sidebar-border p-3', collapsed && 'px-2')}>
        {!collapsed && user && (
          <div className="mb-2 flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {initials || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
              <p className="truncate text-xs capitalize text-sidebar-foreground/55">{role}</p>
            </div>
          </div>
        )}

        {collapsed ? (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={onLogout}
                    aria-label="Log out"
                    className="grid size-10 place-items-center rounded-md text-destructive outline-none transition hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                  />
                }
              >
                <LogOut className="size-[1.125rem]" />
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-destructive outline-none transition hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <LogOut className="size-[1.125rem]" aria-hidden="true" />
            Log out
          </button>
        )}
      </div>
    </div>
  )
}
