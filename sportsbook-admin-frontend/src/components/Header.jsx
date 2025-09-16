import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import './Header.css';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1>Sportsbook Admin</h1>
        </div>
        <nav className="header-nav">
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#users">Users</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;