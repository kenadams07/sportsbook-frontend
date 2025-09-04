import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../routes/path';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import DepositModal from './DepositModal';

const WelcomeComponent = ({ onClose }) => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleOk = () => {
    onClose();
  };
  
  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Clean up localStorage flag when component unmounts
    return () => {
      localStorage.removeItem('showWelcomeModal');
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        {/* Confetti effect */}
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            colors={['#fbbf24', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316']}
          />
        )}
        
        <div className="bg-[#333333] rounded-lg max-w-md w-full px-5 py-10 text-center relative overflow-hidden">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="mb-8 pt-10">
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Successfully registered
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              You are now registered.
            </motion.p>
          </div>

          <div className="space-y-3 mt-24">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                onClick={handleDeposit}
                className="w-full bg-transparent hover:bg-gray-700 text-white font-semibold h-12 text-base border border-gray-600 transition-colors"
              >
                DEPOSIT NOW
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Button
                onClick={handleOk}
                className="w-full bg-transparent hover:bg-gray-700 text-white font-semibold h-12 text-base border border-gray-600 transition-colors"
              >
                OK
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal 
          isOpen={showDepositModal} 
          onClose={() => {
            setShowDepositModal(false);
            onClose(); // Close the welcome modal too when deposit modal is closed
          }} 
        />
      )}
    </>
  );
};

export default WelcomeComponent;