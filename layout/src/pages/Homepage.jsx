import Footer from '../components/Footer'
import Home from '../layouts/layout1/Home'
import React, { useState, useEffect } from 'react'
import WelcomeComponent from '../components/WelcomeComponent'

const Homepage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if we should show welcome modal on component mount
  useEffect(() => {
    const shouldShowWelcome = localStorage.getItem('showWelcomeModal');
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true);
    }
  }, []);

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