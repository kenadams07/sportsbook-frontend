import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaExchangeAlt, 
  FaUsers, 
  FaUserTie,
  FaChartBar, 
  FaMoneyBillWave,
  FaTrashRestore,
  FaCalendarAlt,
  FaListAlt,
  FaCog, 
  FaIdCard,
  FaBell,
  FaGift,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaTag
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggle = () => {
    if (isMobile) {
      onClose();
    } else {
      toggleCollapse();
    }
  };

  const toggleSubMenu = (label) => {
    if (isCollapsed && !isMobile) {
      toggleCollapse();
      setTimeout(() => {
        setExpandedMenus(prev => ({
          ...prev,
          [label]: !prev[label]
        }));
      }, 100);
    } else {
      setExpandedMenus(prev => ({
        ...prev,
        [label]: !prev[label]
      }));
    }
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: <FaTachometerAlt /> 
    },
    { 
      label: 'Running Markets', 
      icon: <FaExchangeAlt />,
      subItems: [
        { label: 'Exchange Market', path: '/markets/exchange' }
      ]
    },
    { 
      label: 'Users', 
      icon: <FaUsers />,
      subItems: [
        { label: 'Add User', path: '/users/add' },
        { label: 'Users', path: '/users/list' },
        { label: 'Inactive Users', path: '/users/inactive' }
      ]
    },
    { 
      label: 'Whitelabel', 
      icon: <FaTag />,
      subItems: [
        { label: 'Add Whitelabel', path: '/whitelabel/add' },
        { label: 'Whitelabel List', path: '/whitelabel/list' },
        { label: 'Inactive Whitelabel List', path: '/whitelabel/inactive' }
      ]
    },
    { 
      label: 'Managers', 
      icon: <FaUserTie />,
      subItems: [
        { label: 'Add Manager', path: '/managers/add' },
        { label: 'Managers', path: '/managers/list' },
        { label: 'Account Managers', path: '/managers/account' },
        { label: 'Operational Managers', path: '/managers/operational' },
        { label: 'Monitoring Managers', path: '/managers/monitoring' }
      ]
    },
    { 
      label: 'Reports', 
      icon: <FaChartBar />,
      subItems: [
        { label: 'Reports', path: '/reports/general' },
        { label: 'Report Analysis', path: '/reports/analysis' },
        { label: 'Casino Report Analysis', path: '/reports/casino-analysis' },
        { label: 'Commission Report', path: '/reports/commission' }
      ]
    },
    { 
      label: 'Currency', 
      icon: <FaMoneyBillWave />,
      subItems: [
        { label: 'Add Currency', path: '/currency/add' },
        { label: 'Currencies', path: '/currency/list' }
      ]
    },
    { 
      label: 'Restore Panel', 
      path: '/restore', 
      icon: <FaTrashRestore /> 
    },
    { 
      label: 'Manage Events', 
      path: '/events', 
      icon: <FaCalendarAlt /> 
    },
    { 
      label: 'Results', 
      path: '/results', 
      icon: <FaListAlt /> 
    },
    { 
      label: 'Settings', 
      icon: <FaCog />,
      subItems: [
        { label: 'Sports Settings', path: '/settings/sports' },
        { label: 'League Settings', path: '/settings/leagues' },
        { label: 'Match Settings', path: '/settings/matches' },
        { label: 'Commission Settings', path: '/settings/commission' }
      ]
    },
    { 
      label: 'Change ID', 
      path: '/change-id', 
      icon: <FaIdCard /> 
    },
    { 
      label: 'Notifications', 
      path: '/notifications', 
      icon: <FaBell /> 
    },
    { 
      label: 'Bonus', 
      path: '/bonus', 
      icon: <FaGift /> 
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <h2>{isCollapsed ? 'AD' : 'Admin Desk'}</h2>
          </div>
          <button className="toggle-btn" onClick={handleToggle}>
            {isMobile ? <FaTimes /> : (isCollapsed ? <FaBars /> : <FaTimes />)}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item, index) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.label];
              const isActive = item.path === location.pathname || 
                             (hasSubItems && item.subItems.some(sub => sub.path === location.pathname));

              return (
                <li key={index} className={`nav-item ${isActive ? 'active-parent' : ''}`}>
                  {hasSubItems ? (
                    <div 
                      className={`nav-link parent-link ${isActive ? 'active' : ''}`}
                      onClick={() => toggleSubMenu(item.label)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="nav-text">{item.label}</span>
                          <span className="arrow-icon">
                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={onClose}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {(!isCollapsed || isMobile) && <span className="nav-text">{item.label}</span>}
                    </Link>
                  )}

                  {hasSubItems && (!isCollapsed || isMobile) && isExpanded && (
                    <ul className="sub-menu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="sub-nav-item">
                          <Link 
                            to={subItem.path} 
                            className={`sub-nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                            onClick={onClose}
                          >
                            <span className="sub-nav-text">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-icon" onClick={handleLogout}>
            <FaSignOutAlt />
            {(!isCollapsed || isMobile) && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;