import React, { useState } from 'react'
// Added useSelector to access authentication state
import { useSelector } from 'react-redux';
import RegisterModal from '../modals/RegisterModal';
import LoginModal from '../modals/LoginModal';
import DepositModal from '../components/DepositModal';

const MobileNavbar = () => {
  // Accessing authentication state from Redux store
  const isAuthenticated = useSelector((state) => state?.Login?.isAuthenticated);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Define navigation links based on authentication status
  const navLinks = [];
  
  // Deposit option is always shown but behaves differently based on authentication
  const handleDepositClick = () => {
    if (isAuthenticated) {
      // User is authenticated, show deposit modal
      setIsDepositModalOpen(true);
    } else {
      // User is not authenticated, show login modal
      setIsLoginModalOpen(true);
    }
  };

  navLinks.push({
    label: "Deposit",
    onClick: handleDepositClick
  });

  if (!isAuthenticated) {
    // Show login and register options only for non-authenticated users
    navLinks.push({
      label: "Login",
      onClick: () => setIsLoginModalOpen(true)
    });
    
    navLinks.push({
      label: "Register",
      onClick: () => setIsRegisterModalOpen(true)
    });
  }

  return (
    <>
      <div className='max-h-[3.5rem] px-2 pb-5 fixed inset-x-0 bottom-0 rounded-t-md z-[100] bg-[#f13636]'>
        <div className='flex justify-around items-center gap-2'>
          {navLinks.map((link) => (
            <p 
              key={link.label} 
              className='block py-2 text-white hover:text-yellow-500 cursor-pointer'
              onClick={link.onClick}
            >
              {link.label}
            </p>
          ))}
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(false);
        }}
      />
      
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </>
  );
};

export default MobileNavbar;