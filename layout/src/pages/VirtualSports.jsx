import React, { useState } from 'react';
import CasinoProvidersGamesSection from '../components/CasinoProvidersGamesSection';

const VirtualSports = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle provider search
  const handleProviderSearch = (query) => {
    setSearchQuery(query);
    // Add your provider search logic here
    console.log("Provider search query:", query);
  };

  // Handle game search
  const handleGameSearch = (query) => {
    setSearchQuery(query);
    // Add your game search logic here
    console.log("Game search query:", query);
  };

  return (
    <div className="casino-container">
      <div className="virtual-sports-header">
        <h1 className="text-2xl font-bold text-white mb-4">Virtual Sports</h1>
        <p className="text-gray-400 mb-6">Experience the thrill of virtual sports betting</p>
      </div>
      
      <CasinoProvidersGamesSection 
        onProviderSearch={handleProviderSearch}
        onGameSearch={handleGameSearch}
      />
      
      {/* You can add virtual sports specific content here */}
      <div className="virtual-sports-content mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Virtual sports game cards would go here */}
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="bg-gray-700 h-40 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">Virtual Football</span>
            </div>
            <h3 className="text-white font-semibold">Virtual Football</h3>
            <p className="text-gray-400 text-sm mt-1">Fast-paced virtual football matches</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="bg-gray-700 h-40 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">Virtual Horse Racing</span>
            </div>
            <h3 className="text-white font-semibold">Virtual Horse Racing</h3>
            <p className="text-gray-400 text-sm mt-1">Exciting virtual horse races</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="bg-gray-700 h-40 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-400">Virtual Tennis</span>
            </div>
            <h3 className="text-white font-semibold">Virtual Tennis</h3>
            <p className="text-gray-400 text-sm mt-1">Quick virtual tennis matches</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualSports;