import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main with-sidebar">
        {children}
      </main>
    </div>
  );
};

export default Layout;