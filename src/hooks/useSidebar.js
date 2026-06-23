import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEYS = {
  collapsed: 'sb:collapsed',
  pinned: 'sb:pinned',
  expanded: 'sb:expanded',
}

/* Breakpoints from the spec. */
const DESKTOP_EXPANDED = 1440 // >= 1440: expanded by default
const MOBILE_MAX = 1024 // < 1024: off-canvas mode

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / privacy mode errors */
  }
}

/** Tracks the current responsive mode: 'mobile' | 'compact' | 'desktop'. */
function useViewport() {
  const get = useCallback(() => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w < MOBILE_MAX) return 'mobile'
    if (w < DESKTOP_EXPANDED) return 'compact'
    return 'desktop'
  }, [])

  const [mode, setMode] = useState(get)

  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setMode(get()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [get])

  return mode
}

/**
 * Central sidebar state manager.
 *
 * Returns desktop collapse state, the mobile drawer open state, expanded
 * submenu tracking, and pinned/favorite item management — all persisted to
 * localStorage where it makes sense.
 */
export function useSidebar() {
  const mode = useViewport()
  const isMobile = mode === 'mobile'

  // Desktop collapse (icons-only) — persisted, restored per spec.
  const [collapsedPref, setCollapsedPref] = useState(() => readJSON(STORAGE_KEYS.collapsed, false))

  // Mobile off-canvas drawer.
  const [mobileOpen, setMobileOpen] = useState(false)

  // Expanded submenu ids (object map -> boolean). Persisted.
  const [expanded, setExpanded] = useState(() => readJSON(STORAGE_KEYS.expanded, {}))

  // Pinned / favorite item ids. Persisted.
  const [pinned, setPinned] = useState(() => readJSON(STORAGE_KEYS.pinned, []))

  // Effective collapsed state depends on viewport:
  //  - >= 1440px: expanded by default (ignore stored collapse unless user set it)
  //  - 1024-1439: remember user preference
  //  - < 1024px:  not applicable (uses drawer)
  const collapsed = useMemo(() => {
    if (isMobile) return false
    if (mode === 'desktop') return collapsedPref
    return collapsedPref
  }, [isMobile, mode, collapsedPref])

  // Persist preferences.
  useEffect(() => writeJSON(STORAGE_KEYS.collapsed, collapsedPref), [collapsedPref])
  useEffect(() => writeJSON(STORAGE_KEYS.expanded, expanded), [expanded])
  useEffect(() => writeJSON(STORAGE_KEYS.pinned, pinned), [pinned])

  // Close the mobile drawer automatically when leaving mobile.
  useEffect(() => {
    if (!isMobile) setMobileOpen(false)
  }, [isMobile])

  const toggleCollapsed = useCallback(() => setCollapsedPref((v) => !v), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const toggleExpanded = useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const setExpandedOpen = useCallback((id, open) => {
    setExpanded((prev) => ({ ...prev, [id]: open }))
  }, [])

  const togglePinned = useCallback((id) => {
    setPinned((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }, [])

  const isPinned = useCallback((id) => pinned.includes(id), [pinned])

  return {
    mode,
    isMobile,
    collapsed,
    mobileOpen,
    expanded,
    pinned,
    toggleCollapsed,
    openMobile,
    closeMobile,
    toggleExpanded,
    setExpandedOpen,
    togglePinned,
    isPinned,
  }
}

/**
 * Filters a navigation tree by the current user role.
 * 'admin' sees everything; items without a `roles` array are visible to all.
 */
export function filterByRole(items, role) {
  if (!role || role === 'admin') return items
  return items
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) =>
      item.items
        ? { ...item, items: item.items.filter((c) => !c.roles || c.roles.includes(role)) }
        : item,
    )
}
