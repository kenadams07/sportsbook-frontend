import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import CasinoProvidersGamesSection from '../components/CasinoProvidersGamesSection';

// Game category components
const GameCategoryButton = ({ icon, label, isActive, onClick }) => (
  <div 
    className={`casino-category-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {icon}
    <span className={`casino-category-label ${isActive ? 'active' : 'inactive'}`}>{label}</span>
  </div>
);

const Casino = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation tabs - Home and Tournaments
  const tabs = [
    { id: "home", label: "Home" },
    { id: "tournaments", label: "Tournaments" }
  ];

  // Game categories with icons
  const gameCategories = [
    { id: "all", label: "All Games", icon: <div className="casino-category-icon-container casino-category-icon-all">All</div> },
    { id: "popular", label: "Popular Games", icon: <div className="casino-category-icon-container casino-category-icon-default">P</div> },
    { id: "table", label: "Table Games", icon: <div className="casino-category-icon-container casino-category-icon-default">T</div> },
    { id: "arcade", label: "Arcade Games", icon: <div className="casino-category-icon-container casino-category-icon-default">A</div> },
    { id: "video", label: "Video Bingo", icon: <div className="casino-category-icon-container casino-category-icon-default">V</div> },
    { id: "instant", label: "Instant Game", icon: <div className="casino-category-icon-container casino-category-icon-default">I</div> },
    { id: "betting", label: "Betting Games", icon: <div className="casino-category-icon-container casino-category-icon-default">B</div> },
    { id: "megaways", label: "Megaways", icon: <div className="casino-category-icon-container casino-category-icon-default">M</div> },
    { id: "lottery", label: "Lottery Games", icon: <div className="casino-category-icon-container casino-category-icon-default">L</div> },
    { id: "slots", label: "Top Slots", icon: <div className="casino-category-icon-container casino-category-icon-default">S</div> },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  // Handle tab change
  const handleTabChange = (tabId) => {
    if (tabId === "tournaments") {
      navigate("/casino/tournaments");
    } else {
      setActiveTab(tabId);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Handle provider search
  const handleProviderSearch = (query) => {
    setSearchQuery(query);
    // Add your provider search logic here
  };

  // Handle game search
  const handleGameSearch = (query) => {
    setSearchQuery(query);
    // Add your game search logic here
  };

  return (
    <div className="casino-container">
      {/* Featured Game Banner */}
      <div className="casino-featured-banner">
        <img 
          src="https://placehold.co/1600x800/2a2a2a/FFA500?text=Olympus+Hades+Megaways" 
          alt="Featured Game" 
          className="casino-banner-img"
        />
        
        {/* Navigation Tabs Overlay */}
        <div className="casino-tabs-overlay">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`casino-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="casino-tab-underline"></div>
              )}
            </button>
          ))}
        </div>

        {/* Game Name Overlay */}
        <div className="casino-game-name-overlay">
          <div className="casino-game-name-badge">
            Olympus Hades megaways
          </div>
        </div>

      </div>

      {/* Game Categories */}
      <div className="casino-categories-container">
        <div className="casino-categories-flex">
          {gameCategories.map(category => (
            <GameCategoryButton
              key={category.id}
              icon={category.icon}
              label={category.label}
              isActive={activeCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Reusable PROVIDERS/GAMES Section */}
      <CasinoProvidersGamesSection 
        onProviderSearch={handleProviderSearch}
        onGameSearch={handleGameSearch}
      />
    </div>
  );
};

export default Casino;