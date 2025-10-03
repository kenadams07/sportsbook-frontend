import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, Search, Globe, Monitor } from "lucide-react";
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { Button } from "../ui/button";
import GameCard from "./GameCard";
import { useLocation, useNavigate } from "react-router-dom";
import SkeletonLoader from "../ui/SkeletonLoader";
import { fetchSportsEvents } from "../../utils/sportsEventsApi";

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

export default function LeftSidebarEventView({ setSelectedMatch = () => {}, setSelectedSport = () => {}, selectedMatch, onSelectedMatchOddsUpdate = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
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
  const oddsPrevRef = useRef({});
  const placeholderIntervalRef = useRef(null);

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
    
    // Check if there's navigation state to pre-select a game
    const { selectedGameId, selectedSportKey } = location.state || {};
    if (selectedGameId && selectedSportKey) {
      // Set the sport as expanded
      setExpanded(prev => ({ ...prev, [selectedSportKey]: true }));
      // Set the selected sport
      const sport = SPORTS.find(s => s.key === selectedSportKey);
      if (sport) {
        setSelectedSport(sport);
      }
      // Clear the location state to prevent issues with subsequent navigation
      if (location.state) {
        // Use navigate with replace to properly clear the location state
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
    
    // Cleanup function to abort any ongoing requests
    return () => {
      abortController.abort();
    };
  }, [selectedType, location.key]);

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
              console.warn(`Invalid data received for sport ${sportKey}, skipping update`);
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
            console.error(`Error polling odds for sport ${sportKey}:`, error);
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
          console.error("Error in pollOdds interval:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error setting up polling interval:", error);
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
    const { selectedGameId, selectedSportKey } = location.state || {};
    
    // Only process location state if it exists
    if (selectedGameId && selectedSportKey) {
      // Set the sport as expanded
      setExpanded(prev => ({ ...prev, [selectedSportKey]: true }));
      
      // Set the selected sport
      const sport = SPORTS.find(s => s.key === selectedSportKey);
      if (sport) {
        setSelectedSport(sport);
      }
      
      // Check if matches data is available for this sport
      const matches = matchesBySport[selectedSportKey] || [];
      if (matches.length > 0) {
        // If matches are loaded, try to find and select the game
        const selectedGame = matches.find(match => match.eventId === selectedGameId);
        if (selectedGame) {
          const team1 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
          const team2 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
          setSelectedMatch({
            ...selectedGame,
            team1,
            team2,
          });
        }
        
        // Clear the location state to prevent issues with subsequent navigation
        navigate(location.pathname, { replace: true, state: {} });
      } else {
        // If matches aren't loaded yet, store the selection for later
        setPendingSelection({ selectedGameId, selectedSportKey });
      }
    }
    // Default behavior - only expand the first sport with matches
    else if (!selectedGameId && !selectedSportKey) {
      // Only expand the first sport with matches, not all sports
      for (const sport of SPORTS) {
        const matches = matchesBySport[sport.key] || [];
        if (matches.length > 0) {
          setExpanded((prev) => {
            // Check if any sport is already expanded
            const isAnySportExpanded = Object.keys(prev).length > 0 && Object.values(prev).some(val => val);
            // If no sport is expanded yet, expand the first one with matches
            if (!isAnySportExpanded && !prev.hasOwnProperty(sport.key)) {
              return { [sport.key]: true };
            }
            return prev;
          });
          
          // Select the first game of the first sport with matches (only if no match is already selected)
          if (!selectedMatch) {
            const firstMatch = matches[0];
            const team1 = firstMatch.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
            const team2 = firstMatch.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
            setSelectedMatch({
              ...firstMatch,
              team1,
              team2,
              // Ensure sportKey is included for markets API call
              sportKey: sport.key
            });
            setSelectedSport(sport);
          }
          break; // Exit after handling the first sport with matches
        }
      }
    }
  }, [matchesBySport, location.state, location.key, selectedMatch, setSelectedMatch, setSelectedSport]);

  // Handle pending selection when matches data is loaded
  useEffect(() => {
    if (pendingSelection) {
      const { selectedGameId, selectedSportKey } = pendingSelection;
      const matches = matchesBySport[selectedSportKey] || [];
      
      if (matches.length > 0) {
        // Try to find and select the game
        const selectedGame = matches.find(match => match.eventId === selectedGameId);
        if (selectedGame) {
          const team1 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '';
          const team2 = selectedGame.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '';
          setSelectedMatch({
            ...selectedGame,
            team1,
            team2,
          });
        }
        
        // Clear pending selection
        setPendingSelection(null);
        
        // Clear the location state to prevent issues with subsequent navigation
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [matchesBySport, pendingSelection, setSelectedMatch, location.pathname]);

  // Filter sports and matches based on search term
  const filteredSports = filterSports(SPORTS, matchesBySport, search);

  return (
    <aside className="flex-1 bg-live-secondary h-full flex flex-col p-2 min-w-0">
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-3">
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
      <div className="mb-3 flex items-center bg-live-tertiary rounded px-2 py-1 relative">
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
      <div className="flex gap-2 mb-3 px-1">
        <button className="bg-live-primary p-2 rounded flex items-center justify-center hover:bg-live-hover">
          <Monitor className="w-5 h-5 text-live-primary" />
        </button>
        <button className="bg-live-primary p-2 rounded flex items-center justify-center hover:bg-live-hover">
          <Globe className="w-5 h-5 text-live-primary" />
        </button>
      </div>
      {/* Sports Accordions */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {filteredSports.map((sport) => {
          const Icon = sport.icon;
          // Filter matches based on search term
          const allMatches = matchesBySport[sport.key] || [];
          const filteredMatches = filterMatches(allMatches, search);
          const matchCount = filteredMatches.length;
          
          return (
            <div key={sport.key} className="mb-2 bg-live-tertiary rounded">
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-live-primary rounded"
                onClick={() => toggleExpand(sport.key)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon className={`w-5 h-5 ${sport.color.replace('bg-', '')}`} />
                  <span className="text-live-primary text-sm font-medium truncate">{sport.sportNames[0]}</span>
                </div>
                <span className="text-xs bg-live-hover text-live-primary rounded px-2 py-0.5 ml-2 min-w-[32px] text-center">{matchCount}</span>
                <div>
                  {expanded[sport.key] ? (
                    <ChevronUp className="w-4 h-4 text-live-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-live-primary" />
                  )}
                </div>
              </div>
              {expanded[sport.key] && (
                <div className="pl-2 pb-2">
                  {loadingBySport[sport.key] ? (
                      <SkeletonLoader type="game-card" count={3} />
                    ) : matchCount === 0 ? (
                      <div className="text-xs text-live-muted px-2 py-2">No matches</div>
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
                        const isSelected = selectedMatch && (selectedMatch.eventId === match.eventId);
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
                              setSelectedMatch({
                                ...match,
                                team1,
                                team2,
                                odds: latestOdds, // Include the latest odds in the selected match data
                                sportKey: sport.key // Include sportKey for markets API call
                              });
                              setSelectedSport(sport);
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