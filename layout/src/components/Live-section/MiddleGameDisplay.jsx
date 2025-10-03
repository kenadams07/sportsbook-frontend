"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoSearchOutline, IoCloseOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { fetchMarketsData } from "../../utils/sportsEventsApi";

const sportImageMap = {
  soccer: "/assets/img1.jpg",
  football: "/assets/img2.jpg",
  basketball: "/assets/img3.jpg",
  tennis: "/assets/img4.jpg",
  cricket: "/assets/img4.jpg",
  baseball: "/assets/img2.jpg",
  hockey: "/assets/img3.jpg",
  volleyball: "/assets/img4.jpg",
};

export default function MiddleGameDisplay({ match, sport, onRunnerSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  if (!match || !sport) {
    return (
      <div className="flex items-center justify-center h-full text-live-muted text-sm">
        Select a game to see details
      </div>
    );
  }

  const sportKey =
    sport?.key?.toLowerCase?.() ||
    sport?.name?.toLowerCase?.() ||
    sport?.toLowerCase?.() ||
    "";

  const imageSrc = sportImageMap[sportKey] || "/assets/img1.jpg";

  // Convert openDate/time to readable format
  let displayTime = match.time || match.openDate;
  if (typeof displayTime === "number" && displayTime > 1000000000000) {
    const dateObj = new Date(displayTime);
    displayTime = dateObj.toLocaleString();
  }

  // Extract team names from eventName
  const teamNames = match.eventName ? match.eventName.split(' vs. ') : ['Team 1', 'Team 2'];
  const team1 = teamNames[0] || 'Team 1';
  const team2 = teamNames[1] || 'Team 2';

  // Use real-time scores from match prop
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;

  return (
    <div className="p-2 flex flex-col gap-4 h-full min-w-0">
      {/* Top Section with Background Image - Fixed height, always visible */}
      <div className="relative w-full h-64 rounded-md overflow-hidden flex-shrink-0">
        {/* Background Image */}
         <img
          src={imageSrc}
          alt={sport?.sportNames?.[0] || sportKey}
          className="w-full h-full object-cover absolute left-0 top-0"
          style={{ zIndex: 0 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/img1.jpg";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col text-white">
          {/* Top section with flag and competition */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-live-info border border-live-primary rounded-sm flex items-center justify-center">
                <span className="text-live-primary text-xs font-bold">🇬🇧</span>
              </div>
              <span className="text-live-primary text-sm font-medium">{match.competitionName || 'League'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-live-dark text-xs px-2 py-1 bg-live-accent rounded ${match.status === 'IN_PLAY' ? 'animate-pulse-highlight in-play-golden' : ''}`}>
                {match.status === 'IN_PLAY' ? 'IN PLAY' : (match.status || 'N/A')}
              </span>
           
            </div>
          </div>

          {/* Middle section with teams and scores */}
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="w-full flex items-center justify-between" style={{ background: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "8px" }}>
              {/* Left side - Teams */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-live-danger text-lg">★</span>
                  <span className="text-live-primary text-lg font-medium">{team1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-live-accent text-lg">★</span>
                  <span className="text-live-primary text-lg font-medium">{team2}</span>
                </div>
              </div>

              {/* Center - Score display */}
              <div className="text-center">
                <div className="text-live-primary text-lg font-bold">
                  {homeScore}-{awayScore} {match.status === 'IN_PLAY' ? (match.halfTimeScore ? `(${match.halfTimeScore})` : '') : ''} {match.status === 'IN_PLAY' ? (match.currentTime ? `${match.currentTime}'` : '') : ''}
                </div>
              </div>

              {/* Right side - Current scores */}
              <div className="text-right space-y-3">
                <div className="text-live-primary text-2xl font-bold">{homeScore}</div>
                <div className="text-live-primary text-2xl font-bold">{awayScore}</div>
              </div>
            </div>
          </div>

          {/* Bottom center - Action buttons */}
          <div className="flex justify-center pb-4">
            <div className="flex gap-2">
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary px-4 py-2 rounded text-sm">
                Stats
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-2 rounded">
                ⚡
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-2 rounded">
                📊
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Navbar Below Image */}
      <SleekNavbar 
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
        onSearchClear={handleSearchClear}
      />

      {/* Market Section - Scrollable area */}
      <div className="flex-grow overflow-hidden flex flex-col">
        <MarketSection 
          selectedMatch={match} 
          onRunnerSelect={onRunnerSelect}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

/**
 * MarketItem Component - Displays a single market with its runners and odds
 */
function MarketItem({ market, isOpen, onToggle, highlightedOdds = {}, onRunnerSelect, selectedMatch }) {
  const contentRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setMeasuredHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, market.runners]);

  // Extract odds from back prices
  const getOdds = (runner) => {
    if (!runner || runner.status === "SUSPENDED") return "SUSPENDED";
    const backPrice = runner.backPrices?.[0]?.price;
    return typeof backPrice === "number" ? backPrice.toFixed(2) : "-";
  };

  // Check if odds have changed for highlighting
  const isOddsHighlighted = (runner, oddsValue) => {
    if (!runner || !highlightedOdds[runner.runnerName]) return false;
    return highlightedOdds[runner.runnerName] === oddsValue;
  };

  // Check if this runner is currently selected
  const isSelectedRunner = (runner) => {
    if (!selectedMatch || !selectedMatch.selectedRunner || !runner) return false;
    return selectedMatch.selectedRunner.runnerId === runner.runnerId;
  };

  // Effect to update selected runner odds when they change
  useEffect(() => {
    // If this runner is selected and odds have changed, notify parent
    if (selectedMatch && selectedMatch.selectedRunner && selectedMatch.selectedMarket && market) {
      const runner = market.runners?.find(r => r && r.runnerId === selectedMatch.selectedRunner.runnerId);
      const isSelected = isSelectedRunner(runner);
      if (isSelected && market.marketId === selectedMatch.selectedMarket.marketId) {
        if (runner) {
          const newOdds = getOdds(runner);
          // Only update if odds have actually changed
          if (newOdds !== selectedMatch.selectedOdd && newOdds !== "SUSPENDED" && newOdds !== "-") {
            // Update the selected runner with new odds
            onRunnerSelect({
              ...selectedMatch,
              selectedMarket: market,
              selectedRunner: runner,
              selectedOdd: newOdds
            });
          }
        }
      }
    }
  }, [market.runners, selectedMatch, market, onRunnerSelect]);

  // Handle runner selection
  const handleRunnerSelect = (runner) => {
    if (onRunnerSelect && selectedMatch) {
      const oddsValue = getOdds(runner);
      if (oddsValue !== "SUSPENDED" && oddsValue !== "-") {
        onRunnerSelect({
          ...selectedMatch,
          selectedMarket: market,
          selectedRunner: runner,
          selectedOdd: oddsValue
        });
      }
    }
  };

  return (
    <div className="transition-colors overflow-hidden bg-gradient-to-r from-live-primary to-live-tertiary shadow rounded">
      {/* Market header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-live-hover transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-live-accent text-xs">⭐</span>
          <span className="text-live-primary font-medium truncate text-xs">{market.marketName}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-live-dark text-[10px] px-2 py-1 bg-live-accent rounded">🔗</span>
          <span className="text-live-accent text-xs">{market.runners?.length || 0}</span>
          <span className="text-live-accent text-sm">📊</span>
          {isOpen ? <IoChevronUp className="w-4 h-4 text-live-primary" /> : <IoChevronDown className="w-4 h-4 text-live-primary" />}
        </div>
      </button>

      {/* Market content */}
      <div
        style={{
          maxHeight: isOpen ? `${measuredHeight}px` : "0px",
          transition: "max-height 280ms ease, opacity 200ms ease",
          overflow: "hidden",
          backgroundColor: "var(--live-bg-tertiary)",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef}>
          <div className="px-3 pb-2.5 pt-1.5">
            <ul className="text-xs text-live-primary space-y-1.5">
              {market.runners && market.runners.length > 0 ? (
                market.runners.map((runner, idx) => {
                  const oddsValue = getOdds(runner);
                  const isHighlighted = isOddsHighlighted(runner, oddsValue);
                  const isSelected = isSelectedRunner(runner);
                  
                  return (
                    <li
                      key={`${market.marketId}-${runner.runnerId}`} // Use unique key
                      className={`flex items-center justify-between py-1.5 px-2 bg-live-hover rounded cursor-pointer hover:bg-live-accent hover:bg-opacity-20 transition-colors ${
                        runner.status === "SUSPENDED" ? "opacity-50 cursor-not-allowed" : ""
                      } ${isSelected ? "ring-2 ring-live-accent" : ""}`}
                      onClick={() => {
                        if (runner.status !== "SUSPENDED") {
                          handleRunnerSelect(runner);
                        }
                      }}
                    >
                      <span className="text-live-primary truncate text-xs">{runner.runnerName}</span>
                      <span className={`text-xs px-2 py-1 rounded font-medium flex-shrink-0 ${
                        runner.status === "SUSPENDED" 
                          ? "bg-live-danger text-white" 
                          : isHighlighted
                            ? "odds-highlight shadow-[0_0_8px_var(--live-accent-primary)] scale-110"
                            : "bg-live-tertiary text-live-primary"
                      }`}>
                        {oddsValue}
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="px-2 py-1.5 text-live-secondary text-xs">No runners available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MarketSection
 * - Two column flex layout (two vertical stacks) so items never jump columns.
 * - Smooth expand/collapse by animating max-height using measured scrollHeight.
 * - Panel shell color: #3c3c3c, content background: #626262
 */
function MarketSection({ selectedMatch, onRunnerSelect, searchTerm = '' }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedById, setExpandedById] = useState({});
  const [allMarketsExpanded, setAllMarketsExpanded] = useState(false);
  const prevMarketsRef = useRef([]);
  const intervalRef = useRef(null);
  const highlightedOddsRef = useRef({});
  const selectedRunnerRef = useRef(null);
  const prevSelectedMatchRef = useRef(null);

  // Store selected runner info
  useEffect(() => {
    if (selectedMatch && selectedMatch.selectedRunner) {
      selectedRunnerRef.current = {
        marketId: selectedMatch.selectedMarket?.marketId,
        runnerId: selectedMatch.selectedRunner?.runnerId,
        eventId: selectedMatch.eventId
      };
    }
  }, [selectedMatch]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Filter markets based on search term
  const filteredMarkets = useMemo(() => {
    if (!searchTerm) return markets;
    
    const term = searchTerm.toLowerCase().trim();
    return markets.filter(market => 
      market.marketName?.toLowerCase().includes(term) ||
      market.runners?.some(runner => 
        runner.runnerName?.toLowerCase().includes(term)
      )
    );
  }, [markets, searchTerm]);

  // Fetch markets data with polling optimization
  useEffect(() => {
    // Check if we're switching to a new match
    const isNewMatch = !prevSelectedMatchRef.current || 
                      (selectedMatch && prevSelectedMatchRef.current.eventId !== selectedMatch.eventId);
    
    // If switching to a new match, show loading state
    if (isNewMatch && selectedMatch) {
      setLoading(true);
      // Clear previous markets immediately when switching matches
      setMarkets([]);
      prevMarketsRef.current = [];
      // Reset expanded state for new match
      setExpandedById({});
      setAllMarketsExpanded(false);
    }
    
    prevSelectedMatchRef.current = selectedMatch;

    if (!selectedMatch || !selectedMatch.eventId || !selectedMatch.sportKey) {
      setMarkets([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLoading(false);
      return;
    }

    const fetchMarkets = async () => {
      try {
        const sportId = SPORT_ID_BY_KEY[selectedMatch.sportKey];
        if (!sportId) {
          setMarkets([]);
          setLoading(false);
          return;
        }

        const marketsData = await fetchMarketsData(selectedMatch.eventId, sportId);
        const newMarkets = Array.isArray(marketsData) ? marketsData : [];
        
        // Only update state if data has actually changed to prevent unnecessary re-renders
        const prevMarkets = prevMarketsRef.current;
        if (JSON.stringify(prevMarkets) !== JSON.stringify(newMarkets)) {
          // Check for odds changes to highlight
          const newHighlightedOdds = {};
          newMarkets.forEach((market, marketIndex) => {
            const prevMarket = prevMarkets[marketIndex];
            if (prevMarket && market.runners) {
              market.runners.forEach((runner, runnerIndex) => {
                const prevRunner = prevMarket.runners?.[runnerIndex];
                if (prevRunner && runner.backPrices?.[0]?.price !== prevRunner.backPrices?.[0]?.price) {
                  newHighlightedOdds[runner.runnerName] = runner.backPrices?.[0]?.price?.toFixed(2) || '-';
                }
              });
            }
          });
          
          if (Object.keys(newHighlightedOdds).length > 0) {
            highlightedOddsRef.current = newHighlightedOdds;
            // Clear highlights after 1 second
            setTimeout(() => {
              highlightedOddsRef.current = {};
            }, 1000);
          }
          
          setMarkets(newMarkets);
          prevMarketsRef.current = newMarkets;
          
          // Initialize all markets as collapsed by default (only for new matches)
          if (isNewMatch && newMarkets.length > 0) {
            const initialExpanded = {};
            newMarkets.forEach((market, index) => {
              initialExpanded[market.marketId || index] = false;
            });
            setExpandedById(initialExpanded);
            setAllMarketsExpanded(false);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching markets data:", error);
        // Only reset markets if there was an actual error and we have previous data
        // This prevents clearing the UI when there are temporary network issues
        if (prevMarketsRef.current.length > 0) {
          // Keep existing markets data instead of clearing it
          console.warn("Keeping existing markets data due to network error");
        }
        setLoading(false);
      }
    };

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Fetch immediately
    fetchMarkets();

    // Set up polling interval with error handling
    try {
      intervalRef.current = setInterval(() => {
        // Add a try-catch around the fetch to prevent interval crashes
        try {
          fetchMarkets();
        } catch (error) {
          console.error("Error in markets polling interval:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error setting up markets polling interval:", error);
    }

    // Clean up on selectedMatch change or component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedMatch, expandedById]);

  const toggleMarket = (marketId) => {
    setExpandedById(prev => ({
      ...prev,
      [marketId]: !prev[marketId]
    }));
  };

  const toggleAllMarkets = () => {
    const newExpandedState = {};
    filteredMarkets.forEach((market, index) => {
      const marketId = market.marketId || index;
      newExpandedState[marketId] = !allMarketsExpanded;
    });
    setExpandedById(newExpandedState);
    setAllMarketsExpanded(!allMarketsExpanded);
  };

  // Split filtered markets into two columns
  const leftColumn = [];
  const rightColumn = [];
  
  filteredMarkets.forEach((market, idx) => {
    const marketId = market.marketId || idx;
    if (idx % 2 === 0) {
      leftColumn.push({ ...market, id: marketId });
    } else {
      rightColumn.push({ ...market, id: marketId });
    }
  });

  if (loading) {
    return (
      <div className="text-live-primary p-4">
        <div className="text-center py-4">Loading markets...</div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="text-live-primary p-4">
        <div className="text-center py-4">No markets available for this event</div>
      </div>
    );
  }

  return (
    <div className="text-live-primary flex flex-col h-full">
      {/* Parent Market Header - Enhanced styling with theme colors */}
      <button
        type="button"
        onClick={toggleAllMarkets}
        className="w-full flex items-center justify-between px-3 py-2 hover:opacity-90 transition-opacity bg-gradient-to-r from-live-primary to-live-secondary shadow-md flex-shrink-0"
      >
        <span className="text-sm font-bold tracking-wide text-live-accent">Market</span>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-80 text-live-accent">{filteredMarkets.length} panels</span>
          {allMarketsExpanded ? (
            <IoChevronUp className="w-5 h-5 text-live-accent" />
          ) : (
            <IoChevronDown className="w-5 h-5 text-live-accent" />
          )}
        </div>
      </button>

      {/* Responsive 2-column layout - Scrollable area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-gradient-to-br from-live-tertiary to-live-secondary rounded-b-md">
          {/* Left column */}
          <div className="space-y-2">
            {leftColumn.map((market) => (
              <MarketItem
                key={market.id}
                market={market}
                isOpen={!!expandedById[market.id]}
                onToggle={() => toggleMarket(market.id)}
                highlightedOdds={highlightedOddsRef.current}
                onRunnerSelect={onRunnerSelect}
                selectedMatch={selectedMatch}
              />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-2">
            {rightColumn.map((market) => (
              <MarketItem
                key={market.id}
                market={market}
                isOpen={!!expandedById[market.id]}
                onToggle={() => toggleMarket(market.id)}
                highlightedOdds={highlightedOddsRef.current}
                onRunnerSelect={onRunnerSelect}
                selectedMatch={selectedMatch}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// SleekNavbar component (unchanged core behavior)
function SleekNavbar({ onSearchChange, searchValue, onSearchClear }) {
  const [searchActive, setSearchActive] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div
      className={`sleek-navbar shadow-md p-2 flex items-center gap-4 transition-all duration-300 bg-live-hover ${
        searchActive ? "navbar-search-active" : ""
      }`}
    >
      {!searchActive ? (
        <>
          {/* Search Icon */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 hover:bg-live-primary transition-colors"
            onClick={() => setSearchActive(true)}
            aria-label="Search"
          >
            <IoSearchOutline className="h-5 w-5 text-live-primary " />
          </button>
          {/* Tabs: All, Match, Totals */}
          <div className="flex gap-6">
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "All" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
              {activeTab === "All" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "Match" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("Match")}
            >
              Match
              {activeTab === "Match" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "Totals" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("Totals")}
            >
              Totals
              {activeTab === "Totals" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Close Icon - replaces search icon when search is active */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 hover:bg-live-primary transition-colors"
            onClick={() => {
              setSearchActive(false);
              onSearchClear();
            }}
            aria-label="Close search"
          >
            <IoCloseOutline className="h-5 w-5 text-live-primary" />
          </button>
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search markets..."
              className="w-full p-2 pl-10 pr-4 border border-live-accent focus:outline-none focus:ring-1 focus:ring-live-accent focus:border-live-accent bg-live-tertiary text-live-primary transition-all duration-300"
            />
            <span className="absolute left-3 top-2.5 text-live-muted">
              <IoSearchOutline className="h-5 w-5" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
