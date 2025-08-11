import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from './ui/menubar';
import { useNavigate } from 'react-router-dom';

const DesktopNav = ({ navItems }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:block w-full">
      <Menubar className="bg-transparent flex justify-start gap-2 border-none text-navbar-text h-10">
        {navItems.map((item) => (
          <MenubarMenu key={item.label}>
            <MenubarTrigger
              className={`
                h-full px-3 rounded-none cursor-pointer flex items-center gap-1 transition-colors duration-200 
                data-[state=open]:bg-black 
                data-[state=open]:border-t-[4px] 
                data-[state=open]:border-chart-5 
                data-[state=open]:text-white
                hover:bg-black hover:border-t-[4px] hover:border-chart-5 hover:text-white
              `}
            >
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </MenubarTrigger>

            <MenubarContent
              className="min-w-[200px] bg-navbar-dropdown border-navbar-border rounded-sm"
              sideOffset={5}
              side="bottom"
            >
              {item.items.map((subItem) => (
                <MenubarItem
                  key={subItem.href}
                  className="text-navbar-text rounded-sm bg-mobile-menu my-2 hover:bg-navbar-dropdown-hover hover:border-l-2 hover:border-l-navbar-highlight cursor-pointer"
                  onClick={() => navigate(subItem.href)}
                >
                  {subItem.label}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
};

export default React.memo(DesktopNav);
