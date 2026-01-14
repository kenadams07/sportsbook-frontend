import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the AuthContext so it can be used directly
export { AuthContext };

export const AuthProvider = ({ children }) => {
  // Default to not logged in - this is the correct behavior
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For testing purposes, we'll allow login with any credentials
    // In a real app, you would validate credentials against a backend
    setIsLoggedIn(true);
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Test login function to bypass authentication for development
  const testLogin = () => {
    setIsLoggedIn(true);
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    testLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};