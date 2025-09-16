import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children, className = '' }) => {
  const { isLoggedIn } = useAuth();
  
  return (
    <div className={`layout ${className}`}>
      {isLoggedIn && <Sidebar />}
      <main className={`layout-main ${isLoggedIn ? 'with-sidebar' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;