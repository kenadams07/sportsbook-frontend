import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const MobileNav = ({ navItems }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navbarRef = useRef(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const isMenuActive = (item) => {
    if (item.href && location.pathname === item.href) return true;
    return item.items && item.items.some((sub) => location.pathname === sub.href);
  };

  const handleNavClick = (item, index) => {
    if (item.items && item.items.length > 0) {
      toggleExpand(index);
    } else if (item.href) {
      navigate(item.href);
      setExpandedIndex(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpandedIndex(null);
      }
    };

    if (expandedIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [expandedIndex]);

  return (
    <>
      {/* Mobile Horizontal Navbar - Clean minimal design */}
      <div className="md:hidden w-full overflow-x-auto scrollbar-hide relative">
        <div ref={navbarRef} className="flex items-center gap-1 min-w-max px-2">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item, index)}
              className={`
                px-3 py-1.5 text-xs font-medium whitespace-nowrap
                transition-all duration-200 flex items-center gap-1
                ${isMenuActive(item)
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-white border-b-2 border-transparent hover:text-yellow-400'
                }
              `}
              style={{ background: 'transparent' }}
            >
              {item.label}
              {item.items && item.items.length > 0 && (
                <ChevronDown 
                  size={12} 
                  className={`transition-transform duration-200 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Panel - positioned directly below navbar with no gap */}
      {expandedIndex !== null && navItems[expandedIndex]?.items && (
        <div 
          ref={dropdownRef}
          className="md:hidden fixed left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg z-50 max-h-[60vh] overflow-y-auto"
          style={{ top: navbarRef.current ? `${navbarRef.current.offsetTop + navbarRef.current.offsetHeight}px` : '44px' }}
        >
          <div className="px-4 py-3 grid grid-cols-2 gap-2">
            {navItems[expandedIndex].items.map((subItem) => (
              <button
                key={subItem.label}
                onClick={() => {
                  navigate(subItem.href, { state: subItem.state });
                  setExpandedIndex(null);
                }}
                className={`
                  px-3 py-2.5 text-xs font-medium text-left rounded
                  transition-colors duration-200
                  ${location.pathname === subItem.href
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                  }
                `}
              >
                {subItem.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(MobileNav);