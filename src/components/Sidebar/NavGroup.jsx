import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavBadge } from '@/components/sidebar/NavBadge'
import { NavLeaf } from '@/components/sidebar/NavLeaf'
import { fadeSlide, flyoutMotion, submenuMotion } from '@/components/sidebar/motion'

/**
 * A top-level navigation group with children.
 *
 * - Expanded sidebar: in-place Collapsible submenu (height/opacity animation).
 * - Collapsed sidebar: hover/focus flyout menu rendered to the side.
 */
export function NavGroup({
  item,
  collapsed,
  expanded,
  onToggleExpanded,
  onNavigate,
  isPinned,
  onTogglePin,
}) {
  const location = useLocation()
  const Icon = item.icon
  const panelId = useId()

  const childActive = item.items?.some((c) => c.path === location.pathname)

  /* ---------- Collapsed: flyout ---------- */
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [anchor, setAnchor] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const closeTimer = useRef(null)

  // Position the portal-rendered flyout next to the trigger so it escapes the
  // ScrollArea's overflow clipping.
  useLayoutEffect(() => {
    if (!flyoutOpen || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setAnchor({ top: r.top, left: r.right + 8 })
  }, [flyoutOpen])

  const openFlyout = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setFlyoutOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setFlyoutOpen(false), 120)
  }

  if (collapsed) {
    return (
      <div
        className="relative"
        onMouseEnter={openFlyout}
        onMouseLeave={scheduleClose}
        onFocus={openFlyout}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFlyoutOpen(false)
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={flyoutOpen}
          aria-label={item.label}
          onClick={() => setFlyoutOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setFlyoutOpen(false)
          }}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-md outline-none transition-colors',
            'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
            childActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
          )}
        >
          {Icon && <Icon className="size-[1.125rem]" aria-hidden="true" />}
          {item.badge && <NavBadge badge={item.badge} dot />}
        </button>

        {createPortal(
          <AnimatePresence>
            {flyoutOpen && (
              <motion.div
                {...flyoutMotion}
                role="menu"
                aria-label={item.label}
                style={{ position: 'fixed', top: anchor.top, left: anchor.left }}
                onMouseEnter={openFlyout}
                onMouseLeave={scheduleClose}
                className="glass-surface z-50 w-56 rounded-lg p-1.5"
              >
                <p className="px-2 py-1.5 text-xs font-semibold text-sidebar-foreground/60">
                  {item.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {item.items.map((child) => (
                    <NavLeaf
                      key={child.id}
                      item={child}
                      nested
                      onNavigate={() => {
                        setFlyoutOpen(false)
                        onNavigate?.()
                      }}
                      pinned={isPinned?.(child.id)}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
      </div>
    )
  }

  /* ---------- Expanded: collapsible ---------- */
  const isOpen = Boolean(expanded)

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggleExpanded(item.id)}
        className={cn(
          'group/group relative flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          childActive
            ? 'text-sidebar-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
        )}
      >
        {Icon && <Icon className="size-[1.125rem] shrink-0" aria-hidden="true" />}
        <span className="flex-1 truncate text-left">{item.label}</span>
        {item.badge && <NavBadge badge={item.badge} />}
        <ChevronRight
          className={cn(
            'size-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200',
            isOpen && 'rotate-90',
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div {...submenuMotion} id={panelId} className="overflow-hidden">
            <motion.ul {...fadeSlide} className="mt-0.5 flex flex-col gap-0.5 py-0.5 pl-4">
              <span
                className="pointer-events-none absolute"
                aria-hidden="true"
              />
              {item.items.map((child) => (
                <li key={child.id} className="relative">
                  <span
                    className="absolute left-0 top-0 h-full w-px bg-sidebar-border"
                    aria-hidden="true"
                  />
                  <div className="pl-3">
                    <NavLeaf
                      item={child}
                      nested
                      onNavigate={onNavigate}
                      pinned={isPinned?.(child.id)}
                      onTogglePin={onTogglePin}
                    />
                  </div>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
