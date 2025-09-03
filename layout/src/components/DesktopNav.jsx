import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from './ui/menubar';
import { useNavigate, useLocation } from 'react-router-dom';

const DesktopNav = ({ navItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if a nav item or its subitems are active
  const isMenuActive = (item) =>
    item.items && item.items.some((sub) => location.pathname === sub.href);

  return (
    <div className="hidden md:block w-full">
      <Menubar className="bg-transparent flex justify-start gap-2 border-none text-navbar-text h-10">
        {navItems.map((item) => (
          <MenubarMenu key={item.label}>
            <MenubarTrigger
              className={`
                h-full px-3 rounded-none cursor-pointer flex items-center gap-1 transition-colors duration-200
                ${isMenuActive(item) ? 'border-b-2 border-yellow-400 text-white font-bold bg-black' : 'hover:bg-black hover:border-b-2 hover:border-yellow-400 hover:text-white'}
              `}
              // If item has href but no items, navigate directly when clicked
              {...(!item.items && item.href ? { onClick: () => navigate(item.href) } : {})}
            >
              {item.label}
              {/* Only show dropdown indicator if item has sub-items */}
              {item.items && item.items.length > 0 && (
                <ChevronDown className="h-4 w-4" />
              )}
            </MenubarTrigger>

            {/* Only show dropdown content if item has sub-items */}
            {item.items && item.items.length > 0 && (
              <MenubarContent
                className="min-w-[200px] bg-navbar-dropdown border-navbar-border rounded-sm"
                sideOffset={5}
                side="bottom"
              >
                {item.items.map((subItem) => (
                  <MenubarItem
                    key={subItem.href}
                    className={`text-navbar-text rounded-sm bg-mobile-menu my-2 hover:bg-navbar-dropdown-hover hover:border-l-2 hover:border-l-navbar-highlight cursor-pointer ${location.pathname === subItem.href ? 'bg-navbar-dropdown-hover border-l-2 border-yellow-400 text-white font-bold' : ''}`}
                    onClick={() => navigate(subItem.href)}
                  >
                    {subItem.label}
                  </MenubarItem>
                ))}
              </MenubarContent>
            )}
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
};

export default React.memo(DesktopNav);