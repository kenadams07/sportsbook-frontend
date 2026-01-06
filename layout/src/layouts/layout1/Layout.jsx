import React from 'react';
import MainNavbar from '../../components/MainNavbar';
import { Outlet, useLocation } from 'react-router-dom';
import MobileNavbar from '../../components/MobileNavbar';
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
      <div className="fixed bottom-0 left-0 right-0 mx-auto px-4 sm:px-6 lg:hidden bg-background w-full z-50">
        <MobileNavbar />
      </div>
      {/* Spacer to prevent content being hidden behind MobileNavbar */}
      <div className="h-16 sm:h-20 lg:hidden" />
    </div>
  );
};

export default Layout;
