import React, { useState, useEffect } from 'react';

const ServerStatusChecker = () => {
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [lastChecked, setLastChecked] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  // Function to check server connectivity
  const checkServerStatus = async () => {
    try {
      // Try to ping the server with a simple request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/api/events?sport_id=sr:sport:1&live_matches=true', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Check server status immediately on component mount
    checkServerStatus();
    
    // Check server status every 30 seconds
    const intervalId = setInterval(() => {
      checkServerStatus();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Show message when server status changes to offline
    if (serverStatus === 'offline') {
      setShowMessage(true);
    }
  }, [serverStatus]);

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  if (!showMessage || serverStatus === 'online') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded relative" role="alert">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              Server Connection Issues
            </p>
            <p className="mt-1 text-sm">
              We're experiencing connection problems with our servers. Some data may be delayed or unavailable. 
              We're working to resolve this issue.
            </p>
            {lastChecked && (
              <p className="mt-1 text-xs text-red-200">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button 
            onClick={handleCloseMessage}
            className="ml-4 flex-shrink-0 text-red-300 hover:text-white focus:outline-none"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusChecker;