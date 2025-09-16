import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 2, title: 'Events', icon: '⚽', path: '/events' },
    { id: 3, title: 'Users', icon: '👥', path: '/users' },
    { id: 4, title: 'Bets', icon: '💰', path: '/bets' },
    { id: 5, title: 'Reports', icon: '📈', path: '/reports' },
    { id: 6, title: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <h2>SportsBet Admin</h2>
          </div>
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '»' : '«'}
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
            Logout
          </Button>
        )}
        {isCollapsed && (
          <button className="logout-icon" onClick={handleLogout} title="Logout">
            <span>🚪</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;