/**
 * Shared motion tokens. We only ever animate transform & opacity (plus height
 * for submenu reveal) — never the sidebar width — and keep durations within the
 * 180-220ms / ease-out-quart envelope from the design spec for a 60fps feel.
 */
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1]
export const DURATION = 0.2

export const fadeSlide = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -6 },
  transition: { duration: DURATION, ease: EASE_OUT_QUART },
}

export const submenuMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: DURATION, ease: EASE_OUT_QUART },
}

export const flyoutMotion = {
  initial: { opacity: 0, x: -8, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -8, scale: 0.98 },
  transition: { duration: DURATION, ease: EASE_OUT_QUART },
}

export const drawerMotion = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: DURATION, ease: EASE_OUT_QUART },
}
