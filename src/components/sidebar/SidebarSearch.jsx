import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { flattenRoutes } from '@/components/sidebar/menu'
import { fadeSlide } from '@/components/sidebar/motion'

/**
 * Inline navigation search. Filters the flattened route list and lets the user
 * jump to any destination via mouse or keyboard (Arrow keys + Enter, Esc).
 */
export function SidebarSearch({ navigation, onNavigate }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const all = useMemo(() => flattenRoutes(navigation), [navigation])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return all
      .filter((r) => r.label.toLowerCase().includes(q) || r.parent?.toLowerCase().includes(q))
      .slice(0, 8)
  }, [all, query])

  const go = (path) => {
    if (!path) return
    navigate(path)
    setQuery('')
    onNavigate?.()
  }

  const onKeyDown = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active]?.path)
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <div className="relative px-3">
      <div className="relative">
        <Search
          className="pointer-events-none p-3 absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/50"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="sidebar-search-results"
          aria-label="Search navigation"
          placeholder="Search…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'h-9 w-full rounded-md border border-sidebar-border bg-sidebar-solid/60 pl-9 pr-8 text-sm text-sidebar-foreground outline-none',
            'placeholder:text-sidebar-foreground/40 focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-sidebar-foreground/50 outline-none hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul
            {...fadeSlide}
            id="sidebar-search-results"
            role="listbox"
            className="glass-surface absolute left-3 right-3 z-40 mt-1.5 max-h-72 overflow-auto rounded-lg p-1.5"
          >
            {results.map((r, i) => (
              <li key={r.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.path)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm outline-none transition-colors',
                    i === active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/40',
                  )}
                >
                  <span className="truncate">{r.label}</span>
                  {r.parent && (
                    <span className="ml-auto truncate text-xs text-sidebar-foreground/45">
                      {r.parent}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
