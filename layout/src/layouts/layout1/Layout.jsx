import React from 'react';
import MainNavbar from '../../components/MainNavbar';
import { Outlet } from 'react-router-dom';
import MobileNavbar from '../../components/MobileNavbar';
import { Toaster } from '../../components/ui/sonner';

const Layout = () => {
  return (
    <div className="w-full">
      {/* Fixed Top Navbar */}
      <MainNavbar />

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
