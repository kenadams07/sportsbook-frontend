import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, Receipt, Dices, Menu } from 'lucide-react';
import MobileDrawer from './MobileDrawer';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'live',
      label: 'Live',
      icon: Activity,
      path: '/live_events/event-view',
      activePaths: ['/live_events']
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Home,
      path: '/',
      activePaths: ['/']
    },
    {
      id: 'betslip',
      label: 'BetSlip',
      icon: Receipt,
      path: '/betslip',
      activePaths: ['/betslip'],
      badge: 0 // Can be dynamic
    },
    {
      id: 'casino',
      label: 'Casino',
      icon: Dices,
      path: '/casino/slots',
      activePaths: ['/casino', '/games']
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Menu,
      path: '/menu',
      activePaths: ['/menu']
    }
  ];

  const isActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavClick = (item) => {
    if (item.id === 'betslip') {
      // Handle betslip click - will be integrated with bet slip state
      return;
    }
    
    if (item.id === 'menu') {
      setIsDrawerOpen(true);
      return;
    }
    
    navigate(item.path);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-live-tertiary border-t border-live shadow-2xl">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.activePaths);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors duration-200 ${
                  active ? 'text-live-accent' : 'text-live-muted'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-live-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-live-accent rounded-b-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default MobileBottomNav;
