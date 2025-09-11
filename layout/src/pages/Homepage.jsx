import Footer from '../components/Footer'
import Home from '../layouts/layout1/Home'
import React, { useState, useEffect } from 'react'
import WelcomeComponent from '../components/WelcomeComponent'
import { useNotification } from '../components/Notify/NotificationProvider';

const Homepage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const notifier = useNotification();
  
  // Check if we should show welcome modal or logout message on component mount
  useEffect(() => {
    // Check for logout message
    const logoutMessage = localStorage.getItem('logoutMessage');
    if (logoutMessage) {
      // Display the logout success message
      notifier.success(logoutMessage, "", 4000);
      // Remove the message from localStorage
      localStorage.removeItem('logoutMessage');
    }
    
    // Check for welcome modal
    const shouldShowWelcome = localStorage.getItem('showWelcomeModal');
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true);
    }
  }, [notifier]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.removeItem('showWelcomeModal');
  };
  
  return (
    <div className='w-full'>
        <Home/>
        <Footer/>
        {showWelcome && <WelcomeComponent onClose={handleCloseWelcome} />}
    </div>
  )
}

export default Homepage