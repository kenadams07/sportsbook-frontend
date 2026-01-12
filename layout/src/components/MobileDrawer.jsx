import React, { useState } from 'react';
import { X, User, CreditCard, History, Settings, Trophy, MessageCircle, HelpCircle, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getLocalStorageItem } from '../utils/Helper';
import MobileDeposit from './MobileDeposit';
import MobileLoginModal from '../modals/MobileLoginModal';
import MobileRegisterModal from '../modals/MobileRegisterModal';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useSelector(state => state.Login);
  const userData = getLocalStorageItem('userData') || {};
  const username = userData.username || 'Guest';
  const userId = userData.userId || '';

  const [activeSection, setActiveSection] = useState('Deposit');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const menuItems = [
    {
      id: 'deposit',
      label: 'Deposit',
      icon: CreditCard,
      requiresAuth: false
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      requiresAuth: true
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      requiresAuth: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      requiresAuth: false
    },
    {
      id: 'bonuses',
      label: 'Bonuses',
      icon: Trophy,
      requiresAuth: false
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageCircle,
      requiresAuth: false
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      requiresAuth: false
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveSection(itemId);
    // Handle navigation or other actions based on the item clicked
    switch(itemId) {
      case 'deposit':
        if (!isAuthenticated) {
          // If not authenticated, redirect to login
          // Or show a login prompt
          alert('Please log in to access deposit functionality');
          return;
        }
        setIsDepositOpen(true);
        break;
      case 'profile':
        // Navigate to profile
        break;
      case 'history':
        // Navigate to history
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-[#2a2a2a] text-white shadow-xl transform transition-all duration-500 ease-in-out" style={{ transform: isOpen ? 'translateX(0%)' : 'translateX(-100%)' }}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            {isAuthenticated && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white mr-3">
                    <span className="font-semibold">{username.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{username}</h3>
                    {userId && (
                      <p className="text-xs text-gray-400 mt-1">ID: {userId}</p>
                    )}
                  </div>
                </div>
                
                {/* Balance info could go here */}
                <div className="mt-3 p-3 bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-md border border-green-500/30">
                  <p className="text-xs text-gray-300">Balance: <span className="text-white font-semibold">0.00 £</span></p>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {menuItems
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700/50 transition-colors ${
                        activeSection === item.id ? 'bg-gray-700/50 border-l-4 border-yellow-500' : ''
                      }`}
                    >
                      <Icon size={20} className="mr-3 text-gray-300" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              {isAuthenticated ? (
                <button className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-900/20 rounded-md transition-colors">
                  <LogOut size={20} className="mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button 
                    type="button"
                    className="w-full bg-yellow-500 text-black py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Login
                  </button>
                  <button 
                    type="button"
                    className="w-full border border-yellow-500 text-yellow-500 py-3 rounded-md font-semibold hover:bg-yellow-500/10 transition-colors mt-2"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MobileDeposit isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <MobileLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <MobileRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(false);
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default MobileDrawer;