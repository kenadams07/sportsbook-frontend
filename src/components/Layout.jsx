import React from 'react';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '@/components/sidebar/Sidebar';

const Layout = ({ children }) => {
  const sidebar = useSidebar();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const contentOffset = sidebar.isMobile ? '0px' : sidebar.collapsed ? '72px' : '280px';

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar sidebar={sidebar} />

      <div
        className="flex min-h-dvh flex-col transition-[margin] duration-200 ease-out"
        style={{ marginLeft: contentOffset }}
      >
        <header className="glass-surface sticky top-0 z-20 flex h-16 items-center gap-3 rounded-none border-x-0 border-t-0 px-4">
          {sidebar.isMobile && (
            <button
              type="button"
              onClick={sidebar.openMobile}
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-md text-foreground/70 outline-none transition hover:bg-accent/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" />
            </button>
          )}
          {/* <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">Operations Console</h1>
            <p className="truncate text-xs text-muted-foreground">
              Risk · Trading · Support · Finance
            </p>
          </div> */}

          <div className="ml-auto hidden items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            Live operations
          </div>
        </header>

        <main
          className={cn(
            'flex-1 p-4 sm:p-6',
            'bg-[radial-gradient(circle_at_top_right,oklch(0.94_0.015_255),transparent_32rem)]'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
