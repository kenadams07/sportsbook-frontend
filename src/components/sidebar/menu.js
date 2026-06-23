import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Tags,
  UserCog,
  BarChart3,
  Banknote,
  Undo2,
  CalendarDays,
  ListChecks,
  Settings,
  IdCard,
  Bell,
  Gift,
} from 'lucide-react'

/**
 * Navigation configuration for the sportsbook operations console.
 *
 * Each item supports:
 *   - id:        stable unique key (used for pinning + expansion state)
 *   - label:     visible text
 *   - path:      route (leaf items only)
 *   - icon:      lucide-react component (top-level items)
 *   - badge:     optional notification badge -> { value, tone }
 *                tone: 'default' | 'success' | 'warning' | 'error'
 *   - roles:     optional array of roles allowed to see the item.
 *                Omit to make the item visible to everyone.
 *   - items:     nested children (one level of nesting, matching the
 *                original menu hierarchy)
 *
 * Roles in use: 'risk' | 'trader' | 'support' | 'finance' | 'admin'
 * 'admin' is treated as a superset in useSidebar's filtering helper.
 */
export const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'running-markets',
    label: 'Running Markets',
    icon: ArrowLeftRight,
    badge: { value: 'Live', tone: 'success' },
    roles: ['risk', 'trader', 'admin'],
    items: [{ id: 'exchange-market', label: 'Exchange Market', path: '/markets/exchange' }],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    roles: ['support', 'admin'],
    items: [
      { id: 'users-add', label: 'Add User', path: '/users/add' },
      { id: 'users-list', label: 'Users', path: '/users/list' },
      { id: 'users-inactive', label: 'Inactive Users', path: '/users/inactive' },
    ],
  },
  {
    id: 'whitelabel',
    label: 'Whitelabel',
    icon: Tags,
    roles: ['admin'],
    items: [
      { id: 'whitelabel-add', label: 'Add Whitelabel', path: '/whitelabel/add' },
      { id: 'whitelabel-list', label: 'Whitelabel List', path: '/whitelabel/list' },
      {
        id: 'whitelabel-inactive',
        label: 'Inactive Whitelabel List',
        path: '/whitelabel/inactive',
      },
    ],
  },
  {
    id: 'managers',
    label: 'Managers',
    icon: UserCog,
    roles: ['admin'],
    items: [
      { id: 'managers-add', label: 'Add Manager', path: '/managers/add' },
      { id: 'managers-list', label: 'Managers', path: '/managers/list' },
      { id: 'managers-account', label: 'Account Managers', path: '/managers/account' },
      { id: 'managers-operational', label: 'Operational Managers', path: '/managers/operational' },
      { id: 'managers-monitoring', label: 'Monitoring Managers', path: '/managers/monitoring' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    roles: ['risk', 'finance', 'admin'],
    items: [
      { id: 'reports-general', label: 'Reports', path: '/reports/general' },
      { id: 'reports-analysis', label: 'Report Analysis', path: '/reports/analysis' },
      {
        id: 'reports-casino-analysis',
        label: 'Casino Report Analysis',
        path: '/reports/casino-analysis',
      },
      { id: 'reports-commission', label: 'Commission Report', path: '/reports/commission' },
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    icon: Banknote,
    roles: ['finance', 'admin'],
    items: [
      { id: 'currency-add', label: 'Add Currency', path: '/currency/add' },
      { id: 'currency-list', label: 'Currencies', path: '/currency/list' },
    ],
  },
  {
    id: 'restore',
    label: 'Restore Panel',
    path: '/restore',
    icon: Undo2,
    roles: ['admin'],
  },
  {
    id: 'events',
    label: 'Manage Events',
    path: '/events',
    icon: CalendarDays,
    roles: ['trader', 'risk', 'admin'],
  },
  {
    id: 'results',
    label: 'Results',
    path: '/results',
    icon: ListChecks,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    roles: ['admin'],
    items: [
      { id: 'settings-sports', label: 'Sports Settings', path: '/settings/sports' },
      { id: 'settings-leagues', label: 'League Settings', path: '/settings/leagues' },
      { id: 'settings-matches', label: 'Match Settings', path: '/settings/matches' },
      { id: 'settings-commission', label: 'Commission Settings', path: '/settings/commission' },
    ],
  },
  {
    id: 'change-id',
    label: 'Change ID',
    path: '/change-id',
    icon: IdCard,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    badge: { value: 3, tone: 'error' },
  },
  {
    id: 'bonus',
    label: 'Bonus',
    path: '/bonus',
    icon: Gift,
    badge: { value: 'New', tone: 'warning' },
  },
]

/** Flat list of every leaf route, used by search and the demo router. */
export function flattenRoutes(items = navigation) {
  const out = []
  for (const item of items) {
    if (item.path) {
      out.push({ id: item.id, label: item.label, path: item.path, icon: item.icon })
    }
    if (item.items) {
      for (const child of item.items) {
        out.push({
          id: child.id,
          label: child.label,
          path: child.path,
          parent: item.label,
          parentIcon: item.icon,
        })
      }
    }
  }
  return out
}
