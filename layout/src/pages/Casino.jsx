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

const GameCard = ({ image, title, description }) => (
  <div className="casino-game-card group">
    <img 
      src={image} 
      alt={title} 
      className="casino-game-card-img"
    />
    <div className="casino-game-overlay">
      <h3 className="casino-game-title">{title}</h3>
      <p className="casino-game-description">{description}</p>
      <button className="casino-play-button">
        Play Now
      </button>
    </div>
    <div className="casino-age-badge">
      +18
    </div>
    <div className="casino-game-name-bottom">
      <p className="casino-game-name-bottom-text">{title}</p>
    </div>
  </div>
);

const casinoGames = [
  {
    id: 1,
    title: 'Olympus Hades Megaways',
    image: 'https://placehold.co/300x200/2a2a2a/FFA500?text=Olympus+Hades',
    description: 'Ancient Greek mythology themed game'
  },
  {
    id: 2,
    title: 'Fortune Tiger',
    image: 'https://placehold.co/300x200/2a2a2a/FF5500?text=Fortune+Tiger',
    description: 'Asian-inspired slots game'
  },
  {
    id: 3,
    title: 'Wolf Gold',
    image: 'https://placehold.co/300x200/2a2a2a/CCCCCC?text=Wolf+Gold',
    description: 'Wildlife themed slots with bonus features'
  },
  {
    id: 4,
    title: 'Book of Dead',
    image: 'https://placehold.co/300x200/2a2a2a/FFCC00?text=Book+of+Dead',
    description: 'Ancient Egyptian adventure'
  },
  {
    id: 5,
    title: "Gonzo's Quest",
    image: 'https://placehold.co/300x200/2a2a2a/00AAFF?text=Gonzo+Quest',
    description: 'Search for El Dorado with cascading reels'
  },
  {
    id: 6,
    title: 'Starburst',
    image: 'https://placehold.co/300x200/2a2a2a/FF00FF?text=Starburst',
    description: 'Colorful cosmic slot with expanding wilds'
  }
];

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

        {/* Responsible Gaming Message */}
        <div className="casino-responsible-gaming">
          <h2>PLEASE GAMBLE RESPONSIBLY</h2>
          <p>BEGAMBLEAWARE.ORG</p>
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

      {/* Game Grid */}
      <div className="casino-game-grid-container">
        <div className="casino-game-grid-flex">
          {/* Empty space to align with PROVIDERS width - hidden on mobile */}
          <div className="casino-providers-placeholder"></div>
          
          {/* Game Cards aligned with GAMES section */}
          <div className="casino-games-container">
            <div className="casino-games-grid">
              {casinoGames.map(game => (
                <GameCard 
                  key={game.id}
                  title={game.title}
                  image={game.image}
                  description={game.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Casino;