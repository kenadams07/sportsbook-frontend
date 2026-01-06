import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import CasinoProvidersGamesSection from '../components/CasinoProvidersGamesSection';
import { Carousel, CarouselContent, CarouselItem } from '../components/ui/carousel';

// Casino banner images
const casinoBanners = [
  { id: 1, src: '/casinoBanners/casino1.png', alt: 'Casino Banner 1' },
  { id: 2, src: '/casinoBanners/casino2.png', alt: 'Casino Banner 2' },
];

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
  const intervalRef = useRef(null);
  const apiRef = useRef(null);

  // Navigation tabs - Home and Tournaments
  const tabs = [
    { id: "home", label: "Home", to: "/casino" },
    { id: "tournaments", label: "Tournaments", to: "/casino/tournaments" }
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

  // Set up carousel API reference and start autoplay
  const setApi = (api) => {
    apiRef.current = api;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start autoplay when API is available
    if (api) {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 3000);
    }
  };

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle user interaction (pause autoplay and restart after interaction)
  const handleUserInteraction = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Restart autoplay
    if (apiRef.current) {
      intervalRef.current = setInterval(() => {
        apiRef.current.scrollNext();
      }, 3000);
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
    <div className="casino-container" style={{ paddingTop: '7rem' }}>
      {/* Home/Tournaments Navigation - Matching Live section style with NavLink */}
      <nav className="flex bg-live-secondary border-b border-live px-6 h-12 items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.to}
            className={({ isActive }) =>
              `h-full flex items-center px-3 sm:px-5 text-sm sm:text-base font-semibold transition-colors duration-200 border-b-2 ${
                isActive
                  ? "text-live-primary border-live-accent bg-live-secondary"
                  : "text-live-muted border-transparent hover:text-live-primary hover:border-live-accent"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* Carousel Container */}
      <div className='w-full rounded-lg overflow-hidden shadow-lg mb-6'>
        <Carousel 
          className='w-full' 
          opts={{ loop: true }}
          setApi={setApi}
          onMouseEnter={() => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }}
          onMouseLeave={handleUserInteraction}
        >
          <CarouselContent className='custom-scrollbar'>
            {casinoBanners.map((item) => (
              <CarouselItem key={item.id} className='w-full'>
                <div className='relative w-full'>
                  <img
                    src={item.src}
                    alt={item.alt}
                    className='w-full object-contain rounded-sm'
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Featured Game Banner */}
      <div className="casino-featured-banner mb-6">
        <img 
          src="https://placehold.co/1600x800/2a2a2a/FFA500?text=Olympus+Hades+Megaways" 
          alt="Featured Game" 
          className="casino-banner-img"
        />
        
        {/* Game Name Overlay */}
        <div className="casino-game-name-overlay">
          <div className="casino-game-name-badge">
            Olympus Hades megaways
          </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="casino-categories-container mb-6">
        <div className="casino-categories-flex flex-wrap">
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

      {/* Reusable PROVIDERS/GAMES Section - Increased height */}
      <div className="mb-6" style={{ height: '400px', minHeight: '400px' }}>
        <CasinoProvidersGamesSection 
          onProviderSearch={handleProviderSearch}
          onGameSearch={handleGameSearch}
        />
      </div>
    </div>
  );
};

export default Casino;