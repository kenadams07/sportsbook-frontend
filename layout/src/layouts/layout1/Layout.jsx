import React from 'react';
import MainNavbar from '../../components/MainNavbar';
import { Outlet, useLocation } from 'react-router-dom';
import MobileBottomNav from '../../components/MobileBottomNav';
import { Toaster } from '../../components/ui/sonner';
import SecondaryLiveNavbar from '../../components/Live-section/SecondaryLiveNavbar';

const Layout = () => {
  const location = useLocation();
  // Show navbar for /live_events and any /live_events/* subroutes
  const showLiveNavbar = location.pathname === '/live_events' || location.pathname.startsWith('/live_events/');

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Fixed Top Navbar */}
      <MainNavbar />
      {/* Secondary Live Navbar */}
      {showLiveNavbar && <SecondaryLiveNavbar />}
      {/* Main Content Area */}
      <div className="flex-grow min-h-screen pb-20 lg:pb-0">
        <Outlet />
      </div>
      {/* Toast Notifications */}
      <Toaster />
      {/* Fixed Bottom Mobile Navbar (Visible only on small screens) */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default Layout;
