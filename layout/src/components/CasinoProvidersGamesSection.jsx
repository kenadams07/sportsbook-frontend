import React, { useState } from 'react';

const CasinoProvidersGamesSection = ({ onProviderSearch, onGameSearch }) => {
  const [providerSearchQuery, setProviderSearchQuery] = useState("");
  const [gameSearchQuery, setGameSearchQuery] = useState("");

  const handleProviderSearch = (e) => {
    const value = e.target.value;
    setProviderSearchQuery(value);
    if (onProviderSearch) {
      onProviderSearch(value);
    }
  };

  const handleGameSearch = (e) => {
    const value = e.target.value;
    setGameSearchQuery(value);
    if (onGameSearch) {
      onGameSearch(value);
    }
  };

  const handleProviderSearchSubmit = () => {
    if (onProviderSearch) {
      onProviderSearch(providerSearchQuery);
    }
  };

  const handleGameSearchSubmit = () => {
    if (onGameSearch) {
      onGameSearch(gameSearchQuery);
    }
  };

  return (
    <div className="casino-main-sections-container">
      {/* Section Headers */}
      <div className="casino-section-headers">
        <div className="casino-section-header casino-providers-header">PROVIDERS</div>
        <div className="casino-section-header">GAMES</div>
      </div>
      
      {/* Search Inputs */}
      <div className="casino-search-container">
        {/* Provider Search */}
        <div className="casino-provider-search-container">
          <input
            type="text"
            placeholder="Provider Search"
            className="casino-search-input"
            value={providerSearchQuery}
            onChange={handleProviderSearch}
            onKeyPress={(e) => e.key === 'Enter' && handleProviderSearchSubmit()}
          />
          <button className="casino-search-button" onClick={handleProviderSearchSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Game Search with Filter */}
        <div className="casino-game-search-container">
          <div className="casino-game-search-input-container">
            <input
              type="text"
              placeholder="Game Search"
              className="casino-game-search-input"
              value={gameSearchQuery}
              onChange={handleGameSearch}
              onKeyPress={(e) => e.key === 'Enter' && handleGameSearchSubmit()}
            />
            <button className="casino-game-search-button" onClick={handleGameSearchSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Filter Button */}
          <button className="casino-filter-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CasinoProvidersGamesSection;