import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/shadcn-ui/sheet'
import { TooltipProvider } from '@/components/shadcn-ui/tooltip'
import { SidebarBody } from '@/components/sidebar/SidebarBody'

/**
 * Production sidebar shell.
 *
 * Desktop: a fixed glassmorphism rail that is either expanded (280px) or
 * collapsed to an icon rail (72px). The width switches instantly — only
 * transform & opacity are animated (labels, flyouts, submenus) per the motion
 * spec — so nothing janks on toggle.
 *
 * Mobile (<1024px): an off-canvas drawer via the Sheet primitive, which
 * provides the backdrop overlay, focus trap, ESC-to-close and outside-click
 * close out of the box.
 */
export function Sidebar({ sidebar }) {
  const { user, role, logout } = useAuthSafe()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout?.()
    sidebar.closeMobile()
    navigate('/login')
  }

  // ----- Mobile drawer -----
  if (sidebar.isMobile) {
    return (
      <TooltipProvider delay={300}>
        <Sheet open={sidebar.mobileOpen} onOpenChange={(open) => (open ? sidebar.openMobile() : sidebar.closeMobile())}>
          <SheetContent
            side="left"
            showCloseButton
            className="glass-surface w-[280px] border-sidebar-border p-0 text-sidebar-foreground sm:max-w-[280px]"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Primary navigation for the sportsbook operations console.
            </SheetDescription>
            <SidebarBody
              sidebar={{ ...sidebar, collapsed: false }}
              user={user}
              role={role}
              onLogout={handleLogout}
              onNavigate={sidebar.closeMobile}
              showCollapseToggle={false}
            />
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    )
  }

  // ----- Desktop rail -----
  return (
    <TooltipProvider delay={300}>
      <aside
        aria-label="Sidebar"
        data-collapsed={sidebar.collapsed}
        className={cn(
          'glass-surface fixed inset-y-0 left-0 z-30 flex flex-col rounded-none border-y-0 border-l-0',
          sidebar.collapsed ? 'w-[72px]' : 'w-[280px]',
        )}
      >
        <SidebarBody
          sidebar={sidebar}
          user={user}
          role={role}
          onLogout={handleLogout}
          onNavigate={undefined}
        />
      </aside>
    </TooltipProvider>
  )
}

/* Tolerate usage outside the demo AuthProvider gracefully. */
function useAuthSafe() {
  try {
    const { user, logout } = useAuth()
    const role = user?.roleName || (user?.role === 1 ? 'admin' : user?.role)
    return { user, role, logout }
  } catch {
    return { user: null, role: null, logout: () => {} }
  }
}
