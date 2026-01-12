import React, { useState } from 'react';
import { X, CreditCard, Eye, ArrowRight, User, Settings, History } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const MobileDeposit = ({ isOpen, onClose, onDeposit }) => {
  const [activePaymentMethod, setActivePaymentMethod] = useState('Skrill');
  const [depositAmount, setDepositAmount] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');

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

  const handleDeposit = (e) => {
    e.preventDefault();
    if (onDeposit) {
      onDeposit({ email, amount: depositAmount, paymentMethod: activePaymentMethod });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Mobile Deposit Sheet */}
      <div className="absolute bottom-0 left-0 right-0 h-5/6 max-h-[90vh] bg-[#2a2a2a] text-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`pb-2 px-1 font-medium ${
                  activeTab === 'deposit' 
                    ? 'text-white border-b-2 border-yellow-500' 
                    : 'text-gray-400'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2 px-1 font-medium ${
                  activeTab === 'history' 
                    ? 'text-white border-b-2 border-yellow-500' 
                    : 'text-gray-400'
                }`}
              >
                History
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'deposit' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Balance Info */}
              <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-300">Main Balance</p>
                    <h3 className="text-xl font-bold">0.00 £</h3>
                  </div>
                  <Eye size={24} className="text-gray-400" />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setActivePaymentMethod(method.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        activePaymentMethod === method.id
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                      }`}
                    >
                      <div className="h-8 mb-2 flex items-center justify-center">
                        <img 
                          src={method.logo} 
                          alt={method.name} 
                          className="max-h-6 w-full object-contain"
                        />
                      </div>
                      <div className="text-xs text-center text-gray-200">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Fee:</span>
                    <span className="ml-2 text-white">{paymentMethods.find(m => m.id === activePaymentMethod)?.fee}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Time:</span>
                    <span className="ml-2 text-white">{paymentMethods.find(m => m.id === activePaymentMethod)?.processTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Min:</span>
                    <span className="ml-2 text-white">{paymentMethods.find(m => m.id === activePaymentMethod)?.min}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Max:</span>
                    <span className="ml-2 text-white">{paymentMethods.find(m => m.id === activePaymentMethod)?.max}</span>
                  </div>
                </div>
              </div>

              {/* Deposit Form */}
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500 h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (£)</label>
                  <Input 
                    type="number" 
                    placeholder="Enter amount" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 focus:border-yellow-500 h-12"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg"
                >
                  DEPOSIT NOW
                </Button>
              </form>

              {/* Gambling Message */}
              <div className="bg-gray-800/50 p-3 text-xs text-gray-400 rounded-lg">
                <p>
                  Safer Gambling: Set limits on your gambling. For support, contact the
                  National Gambling Helpline on 0808 8020 133 or visit{' '}
                  <a href="http://www.begambleaware.org/" className="text-blue-400 hover:underline" target="_blank" rel="noreferrer">
                    begambleaware.org
                  </a>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
              <div className="text-center py-8 text-gray-400">
                <History size={48} className="mx-auto mb-2 opacity-50" />
                <p>No transaction history available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDeposit;