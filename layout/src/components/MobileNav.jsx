import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNav = ({ isOpen, toggleOpen, navItems }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Helper to check if a nav item or its subitems are active
  const isMenuActive = (item) =>
    item.items && item.items.some((sub) => location.pathname === sub.href);

  return (
    <div className="md:hidden relative w-full flex items-center justify-start">
      {/* Moved icon to left side: justify-start */}
      <button
        onClick={toggleOpen}
        className="flex items-center justify-center w-10 h-10 text-navbar-text hover:bg-navbar-dropdown-hover rounded"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="mobile-menu-container absolute left-0 top-10 mt-2 w-56 bg-mobile-menu rounded-md shadow-lg z-50">
          <div className="py-1">
            {navItems.map((item, index) => (
              <div
                key={item.label}
                className="border-b border-navbar-border last:border-b-0"
              >
                <div
                  className={`px-4 py-2 text-navbar-text font-medium cursor-pointer flex justify-between items-center ${isMenuActive(item) ? 'border-b-2 border-yellow-400 text-white font-bold bg-black' : ''}`}
                  // If item has href but no items, navigate directly when clicked
                  {...(!item.items && item.href ? { 
                    onClick: () => {
                      navigate(item.href);
                      toggleOpen();
                    }
                  } : { 
                    onClick: () => toggleExpand(index),
                    role: "button",
                    tabIndex: 0,
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand(index);
                      }
                    }
                  })}
                >
                  <span>{item.label}</span>
                  {/* Show indicator for expandable items only */}
                  {item.items && item.items.length > 0 && (
                    <span className="ml-2 text-sm">{expandedIndex === index ? '-' : '+'}</span>
                  )}
                </div>

                {expandedIndex === index && item.items && item.items.length > 0 && (
                  <div className="bg-navbar-dropdown-hover">
                    {item.items.map((subItem) => (
                      <div
                        key={subItem.label}
                        onClick={() => {
                          navigate(subItem.href);
                          toggleOpen();
                        }}
                        className={`block px-8 py-2 text-navbar-text text-sm hover:bg-navbar-dropdown-hover cursor-pointer ${location.pathname === subItem.href ? 'border-l-2 border-yellow-400 text-white font-bold bg-navbar-dropdown-hover' : ''}`}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MobileNav);