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

const isMatchSuspended = (match) => {
  // Check if match status is suspended
  if (match?.status === "SUSPENDED") return true;
  
  // Check if all odds are suspended (existing logic from GameCard)
  const odds = match?.odds || {};
  if (odds.w1 === "SUSPENDED" && odds.x === "SUSPENDED" && odds.w2 === "SUSPENDED") return true;
  
  // Check if markets are suspended
  const markets = match?.markets?.matchOdds?.[0];
  if (markets?.status === "SUSPENDED") return true;
  
  return false;
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
        <div className="flex flex-col items-center animate-pulse-scale">
          <div className="relative w-12 h-12">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-4 text-live-primary text-sm font-medium">Loading game details...</p>
        </div>
      </div>
    );
  }

  const sportKey =
    match?.sportKey || // From match object (when passed from LeftSidebarEventView)
    sport?.key?.toLowerCase?.() || // From sport prop (when passed from MainLiveSection)
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

  const matchIsSuspended = isMatchSuspended(match);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 h-full min-w-0 w-full">
      {/* Top Section with Background Image - Responsive height */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden flex-shrink-0">
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
          <div className="flex justify-between items-center p-2 sm:p-3 md:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-5 h-3 sm:w-6 sm:h-4 bg-live-info border border-live-primary rounded-sm flex items-center justify-center">
                <span className="text-live-primary text-[10px] sm:text-xs font-bold">🇬🇧</span>
              </div>
              <span className="text-live-primary text-xs sm:text-sm font-medium truncate">{match.competitionName || 'League'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`text-live-dark text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-live-accent rounded ${match.status === 'IN_PLAY' ? 'animate-pulse-highlight in-play-golden' : ''}`}>
                {match.status === 'IN_PLAY' ? 'IN PLAY' : (match.status || 'N/A')}
              </span>
           
            </div>
          </div>

          {/* Middle section with teams and scores */}
          <div className="flex-1 flex items-center justify-between px-2 sm:px-3 md:px-4">
            <div className="w-full flex items-center justify-between" style={{ background: "rgba(0,0,0,0.4)", padding: "8px 12px", borderRadius: "8px" }}>
              {/* Left side - Teams */}
              <div className="space-y-1 sm:space-y-2 md:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <span className="text-live-danger text-sm sm:text-base md:text-lg">★</span>
                  <span className="text-live-primary text-sm sm:text-base md:text-lg font-medium truncate">{team1}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <span className="text-live-accent text-sm sm:text-base md:text-lg">★</span>
                  <span className="text-live-primary text-sm sm:text-base md:text-lg font-medium truncate">{team2}</span>
                </div>
              </div>

        

              {/* Right side - Current scores */}
              <div className="text-right space-y-1 sm:space-y-2 md:space-y-3 flex-shrink-0 ml-2">
                <div className="text-live-primary text-lg sm:text-xl md:text-2xl font-bold">{homeScore}</div>
                <div className="text-live-primary text-lg sm:text-xl md:text-2xl font-bold">{awayScore}</div>
              </div>
            </div>
          </div>

          {/* Bottom center - Action buttons */}
          <div className="flex justify-center pb-2 sm:pb-3 md:pb-4">
            <div className="flex gap-1 sm:gap-2">
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-[10px] sm:text-xs md:text-sm">
                Stats
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-1 sm:p-1.5 md:p-2 rounded text-xs sm:text-sm">
                ⚡
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-1 sm:p-1.5 md:p-2 rounded text-xs sm:text-sm">
                📊
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Section - Scrollable area */}
      <div className="flex-grow overflow-hidden flex flex-col min-h-0">
        {matchIsSuspended ? (
          // Show suspended message instead of markets for suspended matches
          <div className="flex-grow flex items-center justify-center bg-live-tertiary rounded p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <div className="text-live-primary text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">Match Suspended</div>
              <div className="text-live-muted text-[10px] sm:text-xs md:text-sm">Markets are not available for suspended matches</div>
            </div>
          </div>
        ) : (
          <MarketSection 
            selectedMatch={match} 
            onRunnerSelect={onRunnerSelect}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
          />
        )}
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
        className="w-full flex items-center justify-between px-2 sm:px-3 py-2 text-xs sm:py-2.5 hover:bg-live-hover transition-colors"
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
          <div className="px-2 sm:px-3 pb-2 pt-1 sm:pb-2.5 sm:pt-1.5">
            <ul className="text-xs text-live-primary space-y-1 sm:space-y-1.5">
              {market.runners && market.runners.length > 0 ? (
                market.runners.map((runner, idx) => {
                  const oddsValue = getOdds(runner);
                  const isHighlighted = isOddsHighlighted(runner, oddsValue);
                  const isSelected = isSelectedRunner(runner);
                  
                  return (
                    <li
                      key={`${market.marketId}-${runner.runnerId}`} // Use unique key
                      className={`flex items-center justify-between py-1 sm:py-1.5 px-2 bg-live-hover rounded cursor-pointer hover:bg-live-accent hover:bg-opacity-20 transition-colors ${
                        runner.status === "SUSPENDED" ? "opacity-50 cursor-not-allowed" : ""
                      } ${isSelected ? "ring-2 ring-live-accent" : ""}`}
                      onClick={() => {
                        if (runner.status !== "SUSPENDED") {
                          handleRunnerSelect(runner);
                        }
                      }}
                    >
                      <span className="text-live-primary truncate text-xs">{runner.runnerName}</span>
                      <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium flex-shrink-0 ${
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
                <li className="px-2 py-1 sm:py-1.5 text-live-secondary text-xs">No runners available</li>
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
function MarketSection({ selectedMatch, onRunnerSelect, searchTerm = '', onSearchChange, onSearchClear }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedById, setExpandedById] = useState({});
  const [allMarketsExpanded, setAllMarketsExpanded] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [selectedMarketFilter, setSelectedMarketFilter] = useState('All');
  const prevMarketsRef = useRef([]);
  const intervalRef = useRef(null);
  const highlightedOddsRef = useRef({});
  const selectedRunnerRef = useRef(null);
  const prevSelectedMatchRef = useRef(null);
  const currentFetchControllerRef = useRef(null); // To cancel ongoing fetch requests

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

  // Clear interval and controller on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Cancel any ongoing fetch requests
      if (currentFetchControllerRef.current) {
        currentFetchControllerRef.current.abort();
      }
    };
  }, []);

  // Filter markets based on search term and market filter
  useEffect(() => {
    let result = markets;
    
    // Apply market filter
    if (selectedMarketFilter !== 'All') {
      result = result.filter(market => market.marketName === selectedMarketFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(market => 
        market.marketName?.toLowerCase().includes(term) ||
        market.runners?.some(runner => 
          runner.runnerName?.toLowerCase().includes(term)
        )
      );
    }
    
    setFilteredMarkets(result);
  }, [markets, searchTerm, selectedMarketFilter]);

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
      setFilteredMarkets([]);
      prevMarketsRef.current = [];
      // Reset expanded state for new match
      setExpandedById({});
      setAllMarketsExpanded(false);
      setSelectedMarketFilter('All');
      
      // Cancel any ongoing fetch requests for the previous match
      if (currentFetchControllerRef.current) {
        currentFetchControllerRef.current.abort();
      }
    }
    
    prevSelectedMatchRef.current = selectedMatch;

    // Check if we have all required data to fetch markets
    if (!selectedMatch || !selectedMatch.eventId) {
      setMarkets([]);
      setFilteredMarkets([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLoading(false);
      return;
    }

    // Try to get sportKey from multiple possible sources
    const sportKey = selectedMatch.sportKey || selectedMatch.sport?.key || selectedMatch.sport?.name;
    
    if (!sportKey) {
      setMarkets([]);
      setFilteredMarkets([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLoading(false);
      return;
    }

    const fetchMarkets = async () => {
      try {
        // Create a new AbortController for this fetch request
        const controller = new AbortController();
        currentFetchControllerRef.current = controller;
        
        const sportId = SPORT_ID_BY_KEY[sportKey];
        
        if (!sportId) {
          setMarkets([]);
          setFilteredMarkets([]);
          setLoading(false);
          return;
        }

        const marketsData = await fetchMarketsData(selectedMatch.eventId, sportId);
        
        // Check if the request was aborted
        if (controller.signal.aborted) {
          return;
        }
        
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
        // Ignore aborted requests
        if (error.name === 'AbortError') {
          return;
        }
        
        // Removed console.error("Error fetching markets data:", error);
        // Only reset markets if there was an actual error and we have previous data
        // This prevents clearing the UI when there are temporary network issues
        if (prevMarketsRef.current.length > 0) {
          // Keep existing markets data instead of clearing it
          // Removed console.warn("Keeping existing markets data due to network error");
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
          // Removed console.error("Error in markets polling interval:", error);
        }
      }, 1000);
    } catch (error) {
      // Removed console.error("Error setting up markets polling interval:", error);
    }

    // Clean up on selectedMatch change or component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Cancel any ongoing fetch requests
      if (currentFetchControllerRef.current) {
        currentFetchControllerRef.current.abort();
      }
    };
  }, [selectedMatch?.eventId, selectedMatch?.sportKey, selectedMatch]); // Include full selectedMatch for comprehensive updates

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

  // Handle market filter change
  const handleMarketFilter = (filter) => {
    setSelectedMarketFilter(filter);
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

  // Extract market names that appear more than twice for the navbar
  const marketNameCounts = markets.reduce((acc, market) => {
    const name = market.marketName;
    if (name) {
      acc[name] = (acc[name] || 0) + 1;
    }
    return acc;
  }, {});
  
  const marketNames = Object.entries(marketNameCounts)
    .filter(([name, count]) => count > 2)
    .map(([name, count]) => name);

  // Show loading state when switching matches or when markets are loading
  if (loading) {
    return (
      <div className="text-live-primary p-4 flex items-center justify-center h-full">
        <div className="flex flex-col items-center animate-pulse-scale">
          <div className="relative w-12 h-12">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-4 text-live-primary text-sm font-medium">Loading markets...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no markets
  if (filteredMarkets.length === 0) {
    return (
      <div className="text-live-primary p-4 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-bold mb-2">No Markets Available</div>
          <div className="text-sm text-live-muted">There are currently no markets for this event</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Expand/Collapse All button - Modified to show "All Markets" only with theme-matching shadow */}
      <div className="px-2 pb-2 pt-3 cursor-pointer">
        <button
          onClick={toggleAllMarkets}
          className="w-full text-left px-3 py-2 text-xs bg-live-primary hover:bg-live-hover cursor-pointer rounded transition-colors flex items-center justify-between shadow-[0_2px_12px_var(--live-accent-primary)]"
        >
          <span className="text-live-primary font-medium">
            All Markets
          </span>
          <span className="text-live-accent text-xs">
            {filteredMarkets.length} markets
          </span>
        </button>
      </div>

      {/* Sleek Navbar with market names */}
      <div className="px-2 pb-2">
        <SleekNavbar 
          onSearchChange={onSearchChange}
          searchValue={searchTerm}
          onSearchClear={onSearchClear}
          marketNames={marketNames}
          onMarketFilter={handleMarketFilter}
        />
      </div>

      {/* Two-column layout for markets */}
      <div className="flex-grow overflow-y-auto px-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 h-full">
          {/* Left column */}
          <div className="flex-1 space-y-2">
            {leftColumn.map((market) => (
              <MarketItem
                key={market.id}
                market={market}
                isOpen={expandedById[market.id] ?? false}
                onToggle={() => toggleMarket(market.id)}
                highlightedOdds={highlightedOddsRef.current}
                onRunnerSelect={onRunnerSelect}
                selectedMatch={selectedMatch}
              />
            ))}
          </div>
          
          {/* Right column */}
          <div className="flex-1 space-y-2">
            {rightColumn.map((market) => (
              <MarketItem
                key={market.id}
                market={market}
                isOpen={expandedById[market.id] ?? false}
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

/**
 * SleekNavbar Component - Search bar with clear button
 */
function SleekNavbar({ onSearchChange, searchValue, onSearchClear, marketNames = [], onMarketFilter }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      onSearchClear();
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Call the market filter function to filter markets based on selected tab
    if (onMarketFilter) {
      onMarketFilter(tab);
    }
  };

  // Get unique market names from the marketNames prop
  const uniqueMarketNames = [...new Set(marketNames)];

  return (
    <div className="bg-live-tertiary rounded-md px-2 sm:px-3 py-2 flex items-center gap-2">
      {isSearchOpen ? (
        <>
          <button
            onClick={toggleSearch}
            className="text-live-primary hover:text-live-accent flex-shrink-0 mr-3"
          >
            <IoCloseOutline size={18} />
          </button>
          <div className="h-6 w-px bg-live-primary mx-2"></div>
          <input
            type="text"
            placeholder="Search markets or runners..."
            className="flex-grow bg-transparent text-xs sm:text-sm text-live-primary placeholder:text-live-muted focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </>
      ) : (
        <div className="flex items-center w-full overflow-x-auto">
          <button
            onClick={toggleSearch}
            className="text-live-primary hover:text-live-accent flex-shrink-0 mr-3"
          >
            <IoSearchOutline size={18} />
          </button>
          <div className="h-6 w-px bg-live-primary mx-2"></div>
          <div className="flex space-x-3 sm:space-x-6 min-w-max">
            <button 
              className={`text-xs sm:text-sm font-medium relative py-1 px-1 whitespace-nowrap cursor-pointer ${
                activeTab === 'All' 
                  ? 'text-live-accent' 
                  : 'text-live-primary hover:text-live-accent'
              }`}
              onClick={() => handleTabClick('All')}
            >
              All
              {activeTab === 'All' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
            {uniqueMarketNames.map((marketName, index) => (
              <button 
                key={index}
                className={`text-xs sm:text-sm font-medium relative py-1 px-1 whitespace-nowrap cursor-pointer ${
                  activeTab === marketName 
                    ? 'text-live-accent' 
                    : 'text-live-primary hover:text-live-accent'
                }`}
                onClick={() => handleTabClick(marketName)}
              >
                {marketName}
                {activeTab === marketName && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}