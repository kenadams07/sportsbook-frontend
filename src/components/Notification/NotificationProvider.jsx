import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from './Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => showNotification(message, 'success', duration), [showNotification]);
  const showError = useCallback((message, duration) => showNotification(message, 'error', duration), [showNotification]);
  const showWarning = useCallback((message, duration) => showNotification(message, 'warning', duration), [showNotification]);
  const showInfo = useCallback((message, duration) => showNotification(message, 'info', duration), [showNotification]);

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo,
      removeNotification 
    }}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};