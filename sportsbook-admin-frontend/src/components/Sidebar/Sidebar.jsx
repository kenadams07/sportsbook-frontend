import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaFootballBall, 
  FaUsers, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Button from '../ui/Button';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    // Navigate to login page after logout
    navigate('/login');
  };

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { id: 2, title: 'Events', icon: <FaFootballBall />, path: '/events' },
    { id: 3, title: 'Users', icon: <FaUsers />, path: '/users' },
    { id: 4, title: 'Bets', icon: <FaMoneyBillWave />, path: '/bets' },
    { id: 5, title: 'Reports', icon: <FaChartBar />, path: '/reports' },
    { id: 6, title: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <h2>SportsBook Admin</h2>
          </div>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-text">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <Button variant="secondary" onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </Button>
        )}
        {isCollapsed && (
          <button className="logout-icon" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;