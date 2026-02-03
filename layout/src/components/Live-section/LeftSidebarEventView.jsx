import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronUp, Search, Globe, Monitor } from "lucide-react";
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { Button } from "../ui/button";
import GameCard from "./GameCard";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SkeletonLoader from "../ui/SkeletonLoader";
import { fetchSportsEvents } from "../../utils/sportsEventsApi";
import { fetchUserBets } from "../../redux/Action/userBetsActions";

function normalize(str = "") {
  return str.trim().toLowerCase();
}

function extractOddsW1W2(markets) {
  const mo = markets?.matchOdds?.[0];
  
  // Check if market is suspended
  if (mo?.status === "SUSPENDED") {
    return {
      w1: "SUSPENDED",
      x: "SUSPENDED",
      w2: "SUSPENDED"
    };
  }
  
  const runners = mo?.runners || [];
  
  // Find runners by their IDs or by name for draw
  let w1Runner, drawRunner, w2Runner;
  
  // Look for draw runner by name "draw" (case insensitive)
  drawRunner = runners.find(runner => 
    runner.runnerName && runner.runnerName.toLowerCase() === "draw"
  );
  
  // For W1 and W2, we'll take the first and last runners that aren't the draw
  const nonDrawRunners = runners.filter(runner => 
    !runner.runnerName || runner.runnerName.toLowerCase() !== "draw"
  );
  
  w1Runner = nonDrawRunners[0];
  w2Runner = nonDrawRunners.length > 1 ? nonDrawRunners[nonDrawRunners.length - 1] : nonDrawRunners[0];
  
  // Extract odds from back prices
  const w1 = w1Runner?.backPrices?.[0]?.price;
  const x = drawRunner?.backPrices?.[0]?.price;
  const w2 = w2Runner?.backPrices?.[0]?.price;
  
  return {
    w1: typeof w1 === "number" ? w1.toFixed(2) : "-",
    x: typeof x === "number" ? x.toFixed(2) : "-",
    w2: typeof w2 === "number" ? w2.toFixed(2) : "-",
  };
}

// Function to filter matches based on search term
function filterMatches(matches, searchTerm) {
  if (!searchTerm) return matches;
  
  const normalizedSearch = normalize(searchTerm);
  return matches.filter(match => {
    // Check event name (teams)
    if (match.eventName && normalize(match.eventName).includes(normalizedSearch)) {
      return true;
    }
    
    // Check competition name
    if (match.competitionName && normalize(match.competitionName).includes(normalizedSearch)) {
      return true;
    }
    
    // Check sport name
    if (match.sportName && normalize(match.sportName).includes(normalizedSearch)) {
      return true;
    }
    
    // Check if search term matches a date pattern (simplified)
    if (match.openDate) {
      const date = new Date(match.openDate);
      const dateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().slice(-2)}`;
      if (dateStr.includes(searchTerm)) {
        return true;
      }
      
      // Also check for full date format
      const fullDateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      if (fullDateStr.includes(searchTerm)) {
        return true;
      }
    }
    
    return false;
  });
}

// Function to filter sports based on search term
function filterSports(sports, matchesBySport, searchTerm) {
  if (!searchTerm) return sports;
  
  const normalizedSearch = normalize(searchTerm);
  
  // Filter sports that match the search term
  return sports.filter(sport => {
    // Check if sport name matches (e.g., "Basketball" when searching for "Basket")
    if (sport.sportNames.some(name => normalize(name).includes(normalizedSearch))) {
      return true;
    }
    
    // Check if any matches in this sport match the search term
    const matches = matchesBySport[sport.key] || [];
    return filterMatches(matches, searchTerm).length > 0;
  });
}

export default function LeftSidebarEventView({ setSelectedMatch = () => {}, setSelectedSport = () => {}, selectedMatch, onSelectedMatchOddsUpdate = () => {}, selectedSportFilter = null }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selectedType, setSelectedType] = useState("live"); 
  const [matchesBySport, setMatchesBySport] = useState({});
  const [loadingBySport, setLoadingBySport] = useState({});
  const [oddsByEventId, setOddsByEventId] = useState({});
  const [scoresByEventId, setScoresByEventId] = useState({}); // New state for scores
  const [highlightedOdds, setHighlightedOdds] = useState({});
  const [pendingSelection, setPendingSelection] = useState(null); // Track pending game selection
  const [placeholderIndex, setPlaceholderIndex] = useState(0); // For animated placeholder
  const [hasProcessedInitialSelection, setHasProcessedInitialSelection] = useState(false); // Track if initial selection has been processed
  const oddsPrevRef = useRef({});
  const placeholderIntervalRef = useRef(null);
  const hasProcessedLocationState = useRef(false); // To track if location state has been processed

  // Animated placeholder texts
  const placeholderTexts = ["competition", "team", "date"];
  
  // Set up animated placeholder
  useEffect(() => {
    placeholderIntervalRef.current = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholderTexts.length);
    }, 1000);
    
    return () => {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current);
      }
    };
  }, []);

  // Set selectedType based on location state
  useEffect(() => {
    const { viewType } = location.state || {};
    if (viewType === 'prematch') {
      setSelectedType('prematch');
    }
  }, [location.state]);

  // Handle selectedSportFilter change (Mobile View)
  useEffect(() => {
    if (selectedSportFilter) {
      setExpanded(prev => ({ ...prev, [selectedSportFilter.key]: true }));
      setSelectedSport(selectedSportFilter);
    }
  }, [selectedSportFilter, setSelectedSport]);

  // Auto-expand sport when selectedMatch changes (Desktop/General)
  useEffect(() => {
    if (selectedMatch && selectedMatch.sportKey) {
      setExpanded(prev => ({ ...prev, [selectedMatch.sportKey]: true }));
    }
  }, [selectedMatch]);

  // Clear location state on component mount to prevent issues with subsequent navigation
  useEffect(() => {
    if (location.state) {
      // We'll process the state in the other useEffect, but we don't want to clear it immediately
      // as it might be needed for the initial render
    }
  }, []);

  useEffect(() => {
    // Create AbortController for this fetch cycle
    const abortController = new AbortController();
    
    SPORTS.forEach((sport) => {
      const sportId = SPORT_ID_BY_KEY[sport.key];
      if (!sportId) return;
      setLoadingBySport((prev) => ({ ...prev, [sport.key]: true }));
      fetchSportsEvents(sportId, selectedType === "live")
        .then((json) => {
          // Check if the request was aborted
          if (abortController.signal.aborted) {
            return;
          }
          
          const list = json?.sports ?? [];
          setMatchesBySport((prev) => ({ ...prev, [sport.key]: Array.isArray(list) ? list : [] }));
          // Set initial odds and scores
          const oddsMap = { ...oddsByEventId };
          const scoresMap = { ...scoresByEventId };
          for (const e of list) {
            oddsMap[e.eventId] = extractOddsW1W2(e.markets);
            scoresMap[e.eventId] = {
              homeScore: e.homeScore || 0,
              awayScore: e.awayScore || 0
            };
          }
          setOddsByEventId(oddsMap);
          setScoresByEventId(scoresMap);
          oddsPrevRef.current = oddsMap;
        })
        .catch(error => {
          // Ignore aborted requests
          if (error.name === 'AbortError') {
            return;
          }
          setMatchesBySport((prev) => ({ ...prev, [sport.key]: [] }));
        })
        .finally(() => {
          // Check if the request was aborted before updating loading state
          if (!abortController.signal.aborted) {
            setLoadingBySport((prev) => ({ ...prev, [sport.key]: false }));
          }
        });
    });
    
    // Do not process location state here - let the other useEffect handle it after data is loaded
    
    // Cleanup function to abort any ongoing requests
    return () => {
      abortController.abort();
    };
  }, [selectedType]);

  // Only poll odds and scores for the expanded sport
  useEffect(() => {
    let intervalId;
    let abortController = new AbortController(); // Create AbortController for this polling cycle
    
    function pollOdds() {
      // Create a new AbortController for each polling cycle
      abortController = new AbortController();
      
      const expandedSportKeys = Object.keys(expanded).filter((key) => expanded[key]);
      expandedSportKeys.forEach((sportKey) => {
        const sportId = SPORT_ID_BY_KEY[sportKey];
        if (!sportId) return;
        fetchSportsEvents(sportId, selectedType === "live")
          .then((json) => {
            // Check if the request was aborted
            if (abortController.signal.aborted) {
              return;
            }
            
            // Check if we received valid data before processing
            if (!json || !Array.isArray(json.sports)) {
              return;
            }
            
            const list = json.sports;
            const oddsMap = { ...oddsByEventId };
            const scoresMap = { ...scoresByEventId }; // New scores map
            const highlights = { ...highlightedOdds };
            for (const e of list) {
              const newOdds = extractOddsW1W2(e.markets);
              const prevOdds = oddsPrevRef.current[e.eventId] || {};
              oddsMap[e.eventId] = newOdds;
              scoresMap[e.eventId] = { // Update scores
                homeScore: e.homeScore || 0,
                awayScore: e.awayScore || 0,
                halfTimeScore: e.halfTimeScore || null,
                currentTime: e.currentTime || null
              };
              highlights[e.eventId] = {
                w1: prevOdds.w1 !== newOdds.w1,
                w2: prevOdds.w2 !== newOdds.w2,
              };
              
              // If this is the currently selected match, update its odds
              // But only update the basic match data, not overwrite market runner selections
              if (selectedMatch && selectedMatch.eventId === e.eventId) {
                onSelectedMatchOddsUpdate({
                  ...selectedMatch,
                  odds: newOdds,
                  markets: e.markets,
                  homeScore: e.homeScore || 0,
                  awayScore: e.awayScore || 0,
                  halfTimeScore: e.halfTimeScore || null,
                  currentTime: e.currentTime || null,
                  status: e.status || selectedMatch.status
                  // Preserve selectedMarket and selectedRunner if they exist
                });
              }
            }
            setOddsByEventId(oddsMap);
            setScoresByEventId(scoresMap); // Set updated scores
            setHighlightedOdds(highlights);
            oddsPrevRef.current = oddsMap;
            setTimeout(() => {
              setHighlightedOdds({});
            }, 1000);
          })
          .catch(error => {
            // Ignore aborted requests
            if (error.name === 'AbortError') {
              return;
            }
            // Don't stop polling on error, just log it
          });
      });
    }
    
    // Add error handling for the interval setup
    try {
      intervalId = setInterval(() => {
        try {
          pollOdds();
        } catch (error) {
        }
      }, 1000);
    } catch (error) {
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      // Abort any ongoing requests when component unmounts or dependencies change
      abortController.abort();
    };
  }, [selectedType, oddsByEventId, scoresByEventId, expanded, selectedMatch, onSelectedMatchOddsUpdate]);

  const toggleExpand = (sportKey) => {
    // Toggle the expanded state for this sport
    setExpanded(prevExpanded => {
      const isCurrentlyExpanded = prevExpanded[sportKey];
      
      // If currently expanded, collapse it
      if (isCurrentlyExpanded) {
        return {
          ...prevExpanded,
          [sportKey]: false
        };
      } 
      // If currently collapsed, expand it
      else {
        return {
          ...prevExpanded,
          [sportKey]: true
        };
      }
    });
  };

  useEffect(() => {
    // Check if there's navigation state to pre-select a game
    const { selectedGameId: stateGameId, selectedSportKey: stateSportKey } = location.state || {};
    
    // Also check for URL parameters
    const urlGameId = searchParams.get('eventId');
    const urlSportKey = searchParams.get('sportKey');
    
    // Use URL parameters as fallback if state is not available
    const selectedGameId = stateGameId || urlGameId;
    const selectedSportKey = stateSportKey || urlSportKey;
    
    console.log('=== LEFT SIDEBAR EVENT VIEW EFFECT ===');
    console.log('State Game ID:', stateGameId);
    console.log('URL Game ID:', urlGameId);
    console.log('Effective Game ID:', selectedGameId);
    console.log('State Sport Key:', stateSportKey);
    console.log('URL Sport Key:', urlSportKey);
    console.log('Effective Sport Key:', selectedSportKey);
    console.log('Has processed initial selection:', hasProcessedInitialSelection);
    console.log('Selected match exists:', !!selectedMatch);

    if (selectedSportFilter) {
      console.log('Selected sport filter active, skipping default selection');
      return;
    }
    
    // Only process if we have a game ID and haven't processed initial selection yet
    if (selectedGameId && !hasProcessedInitialSelection) {
      console.log('Processing initial selection for game ID:', selectedGameId);
      hasProcessedLocationState.current = true; // Mark as processed
      
      let foundSportKey = selectedSportKey;
      
      // If sport key is not provided, find the sport by searching all matches
      if (!selectedSportKey) {
        for (const sport of SPORTS) {
          const matches = matchesBySport[sport.key] || [];
          const match = matches.find(m => m.eventId === selectedGameId);
          if (match) {
            foundSportKey = sport.key;
            break;
          }
        }
      }
      
      if (foundSportKey) {
        console.log('Found sport key:', foundSportKey);
        // Set the sport as expanded
        setExpanded(prev => ({ ...prev, [foundSportKey]: true }));
        
        // Set the selected sport
        const sport = SPORTS.find(s => s.key === foundSportKey);
        if (sport) {
          setSelectedSport(sport);
        }
        
        // Check if matches data is available for this sport
        const matches = matchesBySport[foundSportKey] || [];
        if (matches.length > 0) {
          // If matches are loaded, try to find and select the game
          const selectedGame = matches.find(match => match.eventId === selectedGameId);
          if (selectedGame) {
            console.log('Found matching game:', selectedGame.eventName);
            const team1 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
            const team2 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
            const selectedMatchData = {
              ...selectedGame,
              team1,
              team2,
              // Ensure sportKey is included for markets API call
              sportKey: foundSportKey
            };
            setSelectedMatch(selectedMatchData);
            
            // Mark that initial selection has been processed
            setHasProcessedInitialSelection(true);
            console.log('Initial selection processed successfully');
          }
        } else {
          // If matches aren't loaded yet, store the selection for later
          console.log('Matches not loaded yet, storing pending selection');
          setPendingSelection({ selectedGameId, selectedSportKey: foundSportKey });
        }
      } else {
        // If we couldn't find the sport, still store the selection for later
        console.log('Could not find sport, storing pending selection');
        setPendingSelection({ selectedGameId, selectedSportKey: null });
      }
    }
    // Default behavior - select first available match if no specific selection
    else if (!selectedGameId && !hasProcessedInitialSelection) {
      console.log('No specific game selected, applying default selection');
      console.log('Selected match exists:', !!selectedMatch);
      console.log('Matches by sport:', Object.keys(matchesBySport).map(key => ({
        sport: key, 
        count: matchesBySport[key]?.length || 0
      })));
      
      // Find the first sport with matches and select its first match
      for (const sport of SPORTS) {
        const matches = matchesBySport[sport.key] || [];
        if (matches.length > 0) {
          console.log(`Found ${matches.length} matches for ${sport.key}`);
          
          setExpanded((prev) => {
            // Check if any sport is already expanded
            const isAnySportExpanded = Object.keys(prev).length > 0 && Object.values(prev).some(val => val);
            // If no sport is already expanded yet, expand the first one with matches
            if (!isAnySportExpanded && !prev.hasOwnProperty(sport.key)) {
              return { [sport.key]: true };
            }
            return prev;
          });
          
          // Select the first game of the first sport with matches (only if no match is already selected)
          if (!selectedMatch) {
            const firstMatch = matches[0];
            console.log('Selecting first match:', firstMatch.eventName);
            
            const team1 = firstMatch.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
            const team2 = firstMatch.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
            const selectedMatchData = {
              ...firstMatch,
              team1,
              team2,
              // Ensure sportKey is included for markets API call
              sportKey: sport.key
            };
            setSelectedMatch(selectedMatchData);
            setSelectedSport(sport);
            console.log('Default selection applied:', firstMatch.eventName);
            
            // Update URL with default selection for persistence
            setSearchParams({
              eventId: firstMatch.eventId,
              sportKey: sport.key,
              eventName: firstMatch.eventName || '',
              viewType: 'live'
            }, { replace: true }); // Use replace to avoid adding to browser history
            console.log('URL updated with default selection:', {
              eventId: firstMatch.eventId,
              sportKey: sport.key,
              eventName: firstMatch.eventName || ''
            });
          } else {
            console.log('Match already selected, skipping default selection');
          }
          
          // Mark initial selection as processed
          setHasProcessedInitialSelection(true);
          break; // Exit after handling the first sport with matches
        }
      }
    }
    else {
      console.log('Skipping selection logic - already processed or has selection');
    }
  }, [matchesBySport, selectedMatch, setSelectedMatch, setSelectedSport, selectedSportFilter, location.state, searchParams]);

  // Handle pending selection when matches data is loaded
  useEffect(() => {
    if (pendingSelection) {
      const { selectedGameId, selectedSportKey } = pendingSelection;
      
      // If we have a specific sport key, use it
      if (selectedSportKey) {
        const matches = matchesBySport[selectedSportKey] || [];
        
        if (matches.length > 0) {
          // Try to find and select the game
          const selectedGame = matches.find(match => match.eventId === selectedGameId);
          if (selectedGame) {
            const team1 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
            const team2 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
            const selectedMatchData = {
              ...selectedGame,
              team1,
              team2,
              // Ensure sportKey is included for markets API call
              sportKey: selectedSportKey
            };
            setSelectedMatch(selectedMatchData);
            
            // Set the sport as expanded
            setExpanded(prev => ({ ...prev, [selectedSportKey]: true }));
            
            // Set the selected sport
            const sport = SPORTS.find(s => s.key === selectedSportKey);
            if (sport) {
              setSelectedSport(sport);
            }
          }
        }
      } else {
        // If no sport key provided, search all sports
        for (const sport of SPORTS) {
          const matches = matchesBySport[sport.key] || [];
          const selectedGame = matches.find(match => match.eventId === selectedGameId);
          if (selectedGame) {
            const team1 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
            const team2 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
            const selectedMatchData = {
              ...selectedGame,
              team1,
              team2,
              // Ensure sportKey is included for markets API call
              sportKey: sport.key
            };
            setSelectedMatch(selectedMatchData);
            
            // Set the sport as expanded
            setExpanded(prev => ({ ...prev, [sport.key]: true }));
            
            // Set the selected sport
            setSelectedSport(sport);
            break; // Stop after finding the first match
          }
        }
      }
      
      // Clear pending selection
      setPendingSelection(null);
      
      // Mark that initial selection has been processed
      setHasProcessedInitialSelection(true);
    }
  }, [matchesBySport, pendingSelection, setSelectedMatch, location.pathname]);

  // Effect to clear location state after initial selection has been processed
  useEffect(() => {
    if (hasProcessedInitialSelection && location.state) {
      // Don't clear state if we're in the middle of an upcoming matches navigation
      // This allows MainLiveSection to properly set URL parameters first
      if (location.state.source === 'upcoming_matches') {
        console.log('=== PRESERVING LOCATION STATE FOR UPCOMING MATCHES FLOW ===');
        console.log('Keeping state for URL parameter setup:', location.state);
        return;
      }
      
      console.log('=== LEFT SIDEBAR CLEARING LOCATION STATE ===');
      console.log('Current pathname:', location.pathname);
      console.log('Current search:', location.search);
      console.log('Current state:', location.state);
      
      // Clear the location state to prevent issues with subsequent navigation
      // Preserve URL search parameters to maintain selected match info
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
      
      console.log('After clearing state - URL should be preserved');
    }
  }, [hasProcessedInitialSelection, location.state, navigate]);

  // Filter sports and matches based on search term
  const filteredSports = filterSports(SPORTS, matchesBySport, search);

  // Apply selectedSportFilter if present (Mobile View)
  const displaySports = selectedSportFilter 
    ? filteredSports.filter(s => s.key === selectedSportFilter.key)
    : filteredSports;

  return (
    <aside className="flex-1 bg-live-secondary h-full flex flex-col p-2 min-w-0 sm:p-2 md:p-2 lg:p-2 xl:p-2">
      {/* Toggle Buttons */}
      <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
        <Button
          variant={selectedType === "live" ? "default" : "outline"}
          size="sm"
          className={`flex-1 text-xs ${
            selectedType === "live" 
              ? "btn-live-toggle-active" 
              : "btn-live-toggle-inactive"
          }`}
          onClick={() => setSelectedType("live")}
        >
          Live
        </Button>
        <Button
          variant={selectedType === "prematch" ? "default" : "outline"}
          size="sm"
          className={`flex-1 text-xs ${
            selectedType === "prematch" 
              ? "btn-live-toggle-active" 
              : "btn-live-toggle-inactive"
          }`}
          onClick={() => setSelectedType("prematch")}
        >
          Prematch
        </Button>
      </div>
      {/* Search Bar with Animated Placeholder */}
      <div className="mb-2 sm:mb-3 flex items-center bg-live-tertiary rounded px-2 py-1 relative">
        <Search className="w-5 h-5 text-live-muted flex-shrink-0 mr-2" />
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder=""
            className="bg-transparent outline-none text-sm text-live-primary w-full py-1 relative z-10"
          />
          {!search && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center">
              <span className="text-live-muted text-sm">Search for a </span>
              <span className="text-live-muted text-sm inline-block w-20 h-5 overflow-hidden ml-1">
                <span className="inline-block animate-slide-up">
                  {placeholderTexts[placeholderIndex]}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Icon Buttons */}
      <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3 px-1">
        <button className="bg-live-primary p-2 rounded flex items-center justify-center hover:bg-live-hover">
          <Monitor className="w-5 h-5 text-live-primary" />
        </button>
        <button className="bg-live-primary p-2 rounded flex items-center justify-center hover:bg-live-hover">
          <Globe className="w-5 h-5 text-live-primary" />
        </button>
      </div>
      {/* Sports Accordions */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {displaySports.map((sport) => {
          const Icon = sport.icon;
          // Filter matches based on search term
          const allMatches = matchesBySport[sport.key] || [];
          const filteredMatches = filterMatches(allMatches, search);
          const matchCount = filteredMatches.length;
          
          // Check if we are in mobile single sport view
          const isMobileSingleView = !!selectedSportFilter;
          
          return (
            <div key={sport.key} className="mb-2 bg-live-tertiary rounded">
              {!isMobileSingleView && (
                <div
                  className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer hover:bg-live-primary rounded"
                  onClick={() => toggleExpand(sport.key)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 ${sport.color.replace('bg-', '')}`} />
                    <span className="text-live-primary text-sm font-medium truncate">{sport.sportNames[0]}</span>
                  </div>
                  <span className="text-xs bg-live-hover text-live-primary rounded px-1.5 sm:px-2 py-0.5 ml-2 min-w-[28px] sm:min-w-[32px] text-center">{matchCount}</span>
                  <div>
                    {expanded[sport.key] ? (
                      <ChevronUp className="w-4 h-4 text-live-primary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-live-primary" />
                    )}
                  </div>
                </div>
              )}
              
              {(expanded[sport.key] || isMobileSingleView) && (
                <div className={`pl-1 sm:pl-2 pb-1 sm:pb-2 ${isMobileSingleView ? 'pt-2' : ''}`}>
                  {loadingBySport[sport.key] ? (
                      <SkeletonLoader type="game-card" count={3} />
                    ) : matchCount === 0 ? (
                      <div className="text-xs text-live-muted px-2 py-1 sm:py-2">No matches</div>
                    ) : (
                      filteredMatches.map((match, idx) => {
                        // Robustly extract team names
                        let team1 = '';
                        let team2 = '';
                        if (match.eventName) {
                          const parts = match.eventName.split(/\s+vs\.?\s+/i);
                          team1 = parts[0]?.trim() || '';
                          team2 = parts[1]?.trim() || '';
                        }
                        const isSelected = selectedMatch && (String(selectedMatch.eventId) === String(match.eventId));
                        const odds = oddsByEventId[match.eventId] || extractOddsW1W2(match.markets);
                        const scores = scoresByEventId[match.eventId] || { homeScore: 0, awayScore: 0 }; // Get scores from state
                  
                        const highlight = highlightedOdds[match.eventId] || { w1: false, w2: false };
                        return (
                          <GameCard
                            key={match.eventId || idx}
                            team1={team1}
                            team2={team2}
                            score1={scores.homeScore} // Use real-time score
                            score2={scores.awayScore} // Use real-time score
                            matchStatus={match.status}
                            time={match.openDate}
                            odds={odds}
                            league={match.competitionName}
                            sport={sport.key}
                            sportKey={sport.key} // Pass sportKey for markets API call
                            highlight={isSelected}
                            oddsHighlight={highlight}
                            onClick={() => {
                              // Get the latest odds for this match
                              const latestOdds = oddsByEventId[match.eventId] || extractOddsW1W2(match.markets);
                          const selectedMatchData = {
                            ...match,
                            team1,
                            team2,
                            odds: latestOdds, // Include the latest odds in the selected match data
                            sportKey: sport.key // Include sportKey for markets API call
                          };
                          // Use the prop function which handles both setting the match and updating URL
                          setSelectedMatch(selectedMatchData);
                          if (!selectedSportFilter) {
                            setSelectedSport(sport);
                          }
                          
                          // The UserBetsSection component will automatically fetch bets when userId and eventId change
                          // So we don't need to dispatch fetchUserBets here
                        }}
                      />
                        );
                      })
                    )
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
