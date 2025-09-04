import React, { useState } from 'react';
import { X, CreditCard, Eye, Settings, User, History, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { getLocalStorageItem } from '../utils/Helper';

const DepositModal = ({ isOpen, onClose }) => {
  const [activePaymentMethod, setActivePaymentMethod] = useState('Skrill');
  const [expandedSections, setExpandedSections] = useState({
    balanceManagement: true,
    bonuses: false,
    profile: false,
    betHistory: false
  });
  const [activeSubmenu, setActiveSubmenu] = useState('Deposit');
  
  const userData = getLocalStorageItem('userData') || {};
  const username = userData.username || 'User';
  const userId = userData.userId || '31724076';

  // Payment methods data
  const paymentMethods = [
    {
      id: 'Skrill',
      name: 'Skrill',
      logo: '/payments/skrill-preview.png',
      fee: 'Free',
      processTime: 'Instant',
      min: '5 £',
      max: '2000 £'
    },
    {
      id: 'SafeCharge',
      name: 'SafeCharge',
      logo: '/payments/safecharge-preview.png',
      fee: 'Free',
      processTime: 'Instant',
      min: '5 £',
      max: '5000 £'
    },
    {
      id: 'MuchBetter',
      name: 'MuchBetter',
      logo: '/payments/MUHBTR.png',
      fee: 'Free',
      processTime: 'Instant',
      min: '5 £',
      max: '5000 £'
    },
    {
      id: 'Neteller',
      name: 'Neteller',
      logo: '/payments/neteller-preview.png',
      fee: 'Free',
      processTime: 'Instant',
      min: '5 £',
      max: '5000 £'
    }
  ];

  const handlePaymentMethodSelect = (id) => {
    setActivePaymentMethod(id);
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    // Handle deposit logic
    // ...
    // Close modal after successful deposit
    onClose();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmenuClick = (menu) => {
    setActiveSubmenu(menu);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-y-auto">
        <div className="flex flex-col h-full max-h-screen">
          {/* Left sidebar */}
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-80 bg-[#2a2a2a] text-white p-4 flex flex-col flex-shrink-0">
              {/* User info section */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white mr-3">
                  <span>{username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{username}</h3>
                  <div className="text-xs text-gray-400 flex items-center">
                    {userId}
                    <div className="ml-1 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account verification status */}
              <div className="mb-4 bg-[#2a2a2a] border border-red-600 rounded-md p-3 flex items-start">
                <div className="text-red-600 mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-300">Account not verified</p>
                </div>
              </div>
              
              {/* Verify account button */}
              <button className="mb-6 w-full border border-red-600 text-white rounded-md py-2 hover:bg-red-800/20 transition-colors">
                VERIFY YOUR ACCOUNT
              </button>
              
              {/* Main balance */}
              <div className="mb-4 bg-gradient-to-r from-green-600 to-green-500 rounded-md p-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20">
                  <Eye size={64} />
                </div>
                <p className="text-sm font-medium mb-1">Main Balance</p>
                <h3 className="text-2xl font-bold mb-3">0.00 £</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center">
                    <CreditCard className="mr-1 h-4 w-4" />
                    DEPOSIT
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center">
                    <ArrowRight className="mr-1 h-4 w-4" />
                    WITHDRAW
                  </Button>
                </div>
              </div>
              
              {/* Bonus balance */}
              <div className="mb-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-md p-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1">Total Bonus Balance</p>
                <h3 className="text-2xl font-bold mb-3">0.00 £</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bonus Balance</span>
                  <span className="text-sm font-medium">0.00 £</span>
                </div>
              </div>
              
              {/* Balance management section */}
              <div className="border-t border-gray-700 py-3">
                <div 
                  className="flex items-center justify-between mb-2 cursor-pointer"
                  onClick={() => toggleSection('balanceManagement')}
                >
                  <div className="flex items-center">
                    <Settings size={18} className="mr-2" />
                    <span className="font-medium">BALANCE MANAGEMENT</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`transform transition-transform ${expandedSections.balanceManagement ? '' : 'rotate-180'}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                {/* Menu items */}
                {expandedSections.balanceManagement && (
                  <div className="pl-7 space-y-3 text-sm">
                    <div 
                      className={`flex items-center pl-2 cursor-pointer ${activeSubmenu === 'Deposit' ? 'text-white border-l-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => handleSubmenuClick('Deposit')}
                    >
                      Deposit
                    </div>
                    <div 
                      className={`flex items-center pl-2 cursor-pointer ${activeSubmenu === 'Withdraw' ? 'text-white border-l-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => handleSubmenuClick('Withdraw')}
                    >
                      Withdraw
                    </div>
                    <div 
                      className={`flex items-center pl-2 cursor-pointer ${activeSubmenu === 'Transaction History' ? 'text-white border-l-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => handleSubmenuClick('Transaction History')}
                    >
                      Transaction History
                    </div>
                    <div 
                      className={`flex items-center pl-2 cursor-pointer ${activeSubmenu === 'Withdraw Status' ? 'text-white border-l-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => handleSubmenuClick('Withdraw Status')}
                    >
                      Withdraw Status
                    </div>
                    <div 
                      className={`flex items-center pl-2 cursor-pointer ${activeSubmenu === 'Net Deposit History' ? 'text-white border-l-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => handleSubmenuClick('Net Deposit History')}
                    >
                      Net Deposit History
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bonuses section */}
              <div className="border-t border-gray-700 py-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('bonuses')}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                    </svg>
                    <span className="font-medium">BONUSES</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transform transition-transform ${expandedSections.bonuses ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                {expandedSections.bonuses && (
                  <div className="pl-7 mt-3 text-sm text-gray-400">
                    No bonus information available
                  </div>
                )}
              </div>
              
              {/* Profile section */}
              <div className="border-t border-gray-700 py-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('profile')}
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2" />
                    <span className="font-medium">MY PROFILE</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transform transition-transform ${expandedSections.profile ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                {expandedSections.profile && (
                  <div className="pl-7 mt-3 text-sm text-gray-400">
                    Profile information will be displayed here
                  </div>
                )}
              </div>
              
              {/* Bet history section */}
              <div className="border-t border-gray-700 py-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('betHistory')}
                >
                  <div className="flex items-center">
                    <History size={18} className="mr-2" />
                    <span className="font-medium">BET HISTORY</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transform transition-transform ${expandedSections.betHistory ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                {expandedSections.betHistory && (
                  <div className="pl-7 mt-3 text-sm text-gray-400">
                    Bet history will be displayed here
                  </div>
                )}
              </div>
            </div>
            
            {/* Right deposit section */}
            <div className="flex-1 overflow-auto bg-[#313131]">
              {/* Header - removed the custom close button since Sheet provides one */}
              <div className="flex justify-between items-center p-5 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Deposit</h2>
                {/* Custom close button removed to avoid duplication */}
              </div>
              
              {/* Payment methods */}
              <div className="p-5">
                {/* Adjusted grid to prevent horizontal scroll and ensure proper responsiveness */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      className={`bg-[#2d2d2d] rounded-md p-4 flex flex-col items-center justify-between cursor-pointer transition-colors border-2 ${activePaymentMethod === method.id ? 'border-yellow-500' : 'border-[#404040]'}`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <div className="h-12 mb-3 flex items-center justify-center w-full">
                        <img 
                          src={method.logo} 
                          alt={method.name} 
                          className="max-h-10 w-full object-contain"
                        />
                      </div>
                      <div className="text-center text-sm text-gray-200 w-full truncate">{method.name}</div>
                    </div>
                  ))}
                </div>
                
                {/* Payment info table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-[#363636] text-gray-400">
                      <tr>
                        <th className="px-4 py-3">Payment Name</th>
                        <th className="px-4 py-3">Fee</th>
                        <th className="px-4 py-3">Process Time</th>
                        <th className="px-4 py-3">Min</th>
                        <th className="px-4 py-3">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#2d2d2d]">
                        <td className="px-4 py-3">{activePaymentMethod}</td>
                        <td className="px-4 py-3">Free</td>
                        <td className="px-4 py-3">Instant</td>
                        <td className="px-4 py-3">5 £</td>
                        <td className="px-4 py-3">2000 £</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Gambling message */}
                <div className="bg-[#2d2d2d] p-4 text-sm text-gray-400 mb-8 rounded">
                  <p>
                    Safer Gambling message: Set limits on your gambling. For support, contact the
                    National Gambling Helpline on 0808 8020 133 or visit{' '}
                    <a href="http://www.begambleaware.org/" className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
                      http://www.begambleaware.org/
                    </a>
                  </p>
                </div>
                
                {/* Deposit form */}
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <Input 
                      type="email" 
                      placeholder="E-mail" 
                      className="bg-[#3a3a3a] text-white border-[#4a4a4a] focus:border-yellow-500 h-12"
                    />
                  </div>
                  <div>
                    <Input 
                      type="number" 
                      placeholder="Amount" 
                      className="bg-[#3a3a3a] text-white border-[#4a4a4a] focus:border-yellow-500 h-12"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  >
                    DEPOSIT
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DepositModal;