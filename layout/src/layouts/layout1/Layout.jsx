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
    <div className="w-full">
      {/* Fixed Top Navbar */}
      <MainNavbar />
      {/* Secondary Live Navbar */}
      {showLiveNavbar && <SecondaryLiveNavbar />}
      {/* Main Content Area */}
      <div className="min-h-screen">
        <Outlet />
      </div>
      {/* Toast Notifications */}
      <Toaster />
      {/* Fixed Bottom Mobile Navbar (Visible only on small screens) */}
      <div className="mx-auto px-6 lg:hidden">
        <MobileNavbar />
      </div>
      {/* Spacer to prevent content being hidden behind MobileNavbar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
};

export default Layout;
