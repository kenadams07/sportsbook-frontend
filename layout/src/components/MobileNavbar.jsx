import React, { useState } from 'react'
import RegisterModal from '../modals/RegisterModal';
import LoginModal from '../modals/LoginModal';
import DepositModal from '../components/DepositModal';

const MobileNavbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const navLinks = [
    {
      label: "Deposit",
      onClick: () => setIsDepositModalOpen(true)
    },
    {
      label: "Login",
      onClick: () => setIsLoginModalOpen(true)
    },
    {
      label: "Register",
      onClick: () => setIsRegisterModalOpen(true)
    }
  ];

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