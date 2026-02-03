"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import LeftSidebarEventView from "./LeftSidebarEventView"
import MiddleGameDisplay from "./MiddleGameDisplay"
import RightEventInfoSection from "./RightEventInfoSection"
import LoginModal from "../../modals/LoginModal"
import RegisterModal from "../../modals/RegisterModal"
import { X, Menu, ChevronLeft } from "lucide-react"
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports"
import { fetchSportsEvents } from "../../utils/sportsEventsApi"
import MobileEventCard from "./MobileEventCard"

function extractOddsW1W2(markets) {
  const mo = markets?.matchOdds?.[0];
  
  if (mo?.status === "SUSPENDED") {
    return { w1: "SUSPENDED", x: "SUSPENDED", w2: "SUSPENDED" };
  }
  
  const runners = mo?.runners || [];
  let w1Runner, drawRunner, w2Runner;
  
  drawRunner = runners.find(runner => 
    runner.runnerName && runner.runnerName.toLowerCase() === "draw"
  );
  
  const nonDrawRunners = runners.filter(runner => 
    !runner.runnerName || runner.runnerName.toLowerCase() !== "draw"
  );
  
  w1Runner = nonDrawRunners[0];
  w2Runner = nonDrawRunners.length > 1 ? nonDrawRunners[nonDrawRunners.length - 1] : nonDrawRunners[0];
  
  const w1 = w1Runner?.backPrices?.[0]?.price;
  const x = drawRunner?.backPrices?.[0]?.price;
  const w2 = w2Runner?.backPrices?.[0]?.price;
  
  return {
    w1: typeof w1 === "number" ? w1.toFixed(2) : "-",
    x: typeof x === "number" ? x.toFixed(2) : "-",
    w2: typeof w2 === "number" ? w2.toFixed(2) : "-",
  };
}

export default function MainLiveSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const selectedRunnerRef = useRef(null);
  
  // Mobile navigation states - Multi-level hierarchy
  const [mobileView, setMobileView] = useState(() => {
    // Initialize view based on navigation source to prevent flash of wrong screen
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const state = location.state || {};
      if (state.source === 'upcoming_matches' && state.selectedGameId) {
        return 'markets';
      }
    }
    return 'sports';
  }); 
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false)
  
  // Mobile events data
  const [mobileEvents, setMobileEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [selectedType, setSelectedType] = useState("live")
  const [entrySource, setEntrySource] = useState(location.state?.source || null)
  const [mobileHeaderSport, setMobileHeaderSport] = useState(null)
  
  // Get the eventId from URL parameters
  const eventIdFromUrl = searchParams.get('eventId');

  useEffect(() => {
    console.log('=== MAIN LIVE SECTION EFFECT TRIGGERED ===');
    console.log('Location state:', location.state);
    console.log('Current URL search params:', window.location.search);
    console.log('EventId from URL params:', eventIdFromUrl);
    
    const navigationState = location.state || {};
    // Check if we have a selected game ID from either URL or navigation state
    const selectedGameIdFromUrl = eventIdFromUrl;
    const selectedGameIdFromState = navigationState.selectedGameId;
    const selectedGameId = selectedGameIdFromState || selectedGameIdFromUrl;
    
    // Determine the source
    const source = navigationState.source || null;
    
    console.log('SelectedGameId from URL:', selectedGameIdFromUrl);
    console.log('SelectedGameId from state:', selectedGameIdFromState);
    console.log('Effective selectedGameId:', selectedGameId);
    console.log('Source:', source);
    console.log('Entry source:', entrySource);
    
    // We should process if we have a selectedGameId OR if we're coming from upcoming matches
    // OR if we're doing initial load with no specific selection (for default match selection)
    if (!selectedGameId && source !== 'upcoming_matches' && entrySource !== 'upcoming_matches') {
      console.log('Returning early - no selectedGameId and not from upcoming_matches');
      return;
    }
    // Remove the mobile-only check to allow deep linking/navigation on desktop too
    // if (window.innerWidth >= 768) return;

    let cancelled = false;
    const viewType = navigationState.viewType;
    const isLive = viewType !== "prematch";
    const requestedSportKey = navigationState.selectedSportKey;

    setEntrySource(navigationState.source || null);

    async function loadSelectedMatch() {
      setLoadingEvents(true);
      try {
        // If we have both sportKey and gameId from upcoming matches, 
        // we can directly set the selected match without fetching the full list first
        // This is much faster and follows the requested "direct flow"
        if (source === 'upcoming_matches' && selectedGameId) {
          // Use requestedSportKey if available, otherwise try to get it from matchDetails
          const effectiveSportKey = requestedSportKey || navigationState.matchDetails?.sportKey;
          
          if (effectiveSportKey) {
            const sport = SPORTS.find((s) => s.key === effectiveSportKey);
            if (sport) {
              setSelectedSport(sport);
              setMobileHeaderSport(sport);
              
              // Construct a partial match object with what we know
              // The MiddleGameDisplay component will fetch the full markets
              const matchDetails = navigationState.matchDetails || {};
              
              const selectedMatchData = {
                eventId: selectedGameId,
                sportKey: effectiveSportKey,
                sportId: SPORT_ID_BY_KEY[effectiveSportKey],
                // Populate from passed details if available
                eventName: matchDetails.eventName || "", 
                team1: matchDetails.team1 || "",
                team2: matchDetails.team2 || "",
                openDate: matchDetails.openDate || Date.now(), 
                status: matchDetails.status || "UPCOMING"
              };
              
              setSelectedMatch(selectedMatchData);

              // Update URL with the match info for persistence
              // Always update URL when coming from upcoming matches to ensure proper URL format
              console.log('=== UPDATING URL FROM UPCOMING MATCHES ===');
              console.log('Setting params:', {
                eventId: selectedGameId,
                sportKey: effectiveSportKey,
                eventName: matchDetails.eventName || '',
                viewType: 'live',
                source: 'upcoming_matches'
              });
              setSearchParams({
                eventId: selectedGameId,
                sportKey: effectiveSportKey,
                eventName: matchDetails.eventName || '',
                viewType: 'live',
                source: 'upcoming_matches'
              });

              setMobileView("markets");
              return;
            }
          }
          // If we don't have a sportKey but still have a selectedGameId from upcoming matches,
          // we'll continue to the next part of the function to fetch the match details
        }

        const searchSportKeys = requestedSportKey
          ? [requestedSportKey]
          : SPORTS.map((s) => s.key);

        for (const sportKey of searchSportKeys) {
          const sportId = SPORT_ID_BY_KEY[sportKey];
          if (!sportId) continue;

          const json = await fetchSportsEvents(sportId, isLive);
          if (cancelled) return;

          const list = Array.isArray(json?.sports) ? json.sports : [];
          const match = list.find((m) => String(m.eventId) === String(selectedGameId));
          if (!match) continue;

          const sport = SPORTS.find((s) => s.key === sportKey) || null;
          if (sport) {
            setSelectedSport(sport);
            setMobileHeaderSport(sport);
          }

          const parts = match.eventName ? match.eventName.split(/\s+vs\.?\s+/i) : [];
          const team1 = parts[0]?.trim() || "";
          const team2 = parts[1]?.trim() || "";

          const selectedMatchData = {
            ...match,
            team1,
            team2,
            odds: extractOddsW1W2(match.markets),
            sportKey
          };
          
          setSelectedMatch(selectedMatchData);
          
          // Update URL with the match info for persistence
          // Only update if parameters are different to prevent infinite loops
          console.log('=== UPDATING URL FROM MATCH FETCH ===');
          const currentParams = new URLSearchParams(window.location.search);
          console.log('Current params eventId:', currentParams.get('eventId'));
          console.log('Current params sportKey:', currentParams.get('sportKey'));
          console.log('New eventId:', match.eventId);
          console.log('New sportKey:', sportKey);
          
          if (currentParams.get('eventId') !== match.eventId || 
              currentParams.get('sportKey') !== sportKey) {
            console.log('Params differ - updating URL');
            setSearchParams({
              eventId: match.eventId,
              sportKey: sportKey,
              eventName: match.eventName || '',
              source: entrySource || '',
              viewType: viewType || 'live'
            });
          } else {
            console.log('Params are the same - skipping URL update');
          }
          
          setMobileView("markets");
          return;
        }
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    }

    loadSelectedMatch();
    return () => {
      cancelled = true;
    };
  }, [eventIdFromUrl, entrySource]);


  useEffect(() => {
    // Get the eventId from URL parameters
    const eventIdFromUrl = searchParams.get('eventId');
    const urlSource = location.state?.source || entrySource || searchParams.get('source') || '';
    
    // If we're coming from upcoming matches and already have a selected match with the same eventId, skip this effect
    if (urlSource === 'upcoming_matches' && selectedMatch && eventIdFromUrl === selectedMatch.eventId) {
      return;
    }
    
    // If we don't have an eventIdFromUrl, nothing to process
    if (!eventIdFromUrl) return;
    
    // When we direct link to markets without full event details, we need to fetch event details 
    // MiddleGameDisplay will fetch markets, but we need team names etc.
    // Also use the local state check or ensure entrySource is up to date.
    // Since this is a separate effect, entrySource state should be updated by now,
    // but relying on the location state is safer for initial load.
    const effectSource = location.state?.source || entrySource;
    
    if (effectSource === 'upcoming_matches' && selectedMatch && (!selectedMatch.team1 || !selectedMatch.eventName)) {
       const fetchEventDetails = async () => {
         try {
           const sportId = selectedMatch.sportId || SPORT_ID_BY_KEY[selectedMatch.sportKey];
           if (!sportId) return;
           
           // Fetch event list to find our specific event and get details
           // This runs in background while markets are already loading in MiddleGameDisplay
           const isLive = location.state?.viewType !== "prematch";
           const json = await fetchSportsEvents(sportId, isLive);
           
           const list = Array.isArray(json?.sports) ? json.sports : [];
           const match = list.find((m) => String(m.eventId) === String(selectedMatch.eventId));
           
           if (match) {
             const parts = match.eventName ? match.eventName.split(/\s+vs\.?\s+/i) : [];
             const team1 = parts[0]?.trim() || "";
             const team2 = parts[1]?.trim() || "";
             
             setSelectedMatch(prev => ({
               ...prev,
               ...match,
               team1,
               team2,
               odds: extractOddsW1W2(match.markets)
             }));
           }
         } catch (e) {
           console.error("Failed to fetch event details", e);
         }
       };
       
       fetchEventDetails();
    }
  }, [eventIdFromUrl, selectedMatch, entrySource]);

  // Function to update the selected match with new odds
  const updateSelectedMatchOdds = (updatedMatch) => {
    setSelectedMatch(prevMatch => {
      // Only update if this is the same match that's currently selected
      if (prevMatch && prevMatch.eventId === updatedMatch.eventId) {
        // Preserve market runner selection if it exists
        if (selectedRunnerRef.current && selectedRunnerRef.current.eventId === updatedMatch.eventId) {
          return {
            ...updatedMatch,
            selectedMarket: selectedRunnerRef.current.selectedMarket,
            selectedRunner: selectedRunnerRef.current.selectedRunner,
            selectedOdd: selectedRunnerRef.current.selectedOdd
          };
        }
        return updatedMatch;
      }
      return prevMatch;
    });
  };

  // Handle runner selection from middle section
  const handleRunnerSelect = (runnerInfo) => {
    // Store the selected runner info in ref to persist across re-renders
    selectedRunnerRef.current = runnerInfo;
    
    // Also update the selected match with the market runner info
    setSelectedMatch(prevMatch => {
      if (prevMatch && prevMatch.eventId === runnerInfo.eventId) {
        return {
          ...prevMatch,
          selectedMarket: runnerInfo.selectedMarket,
          selectedRunner: runnerInfo.selectedRunner,
          selectedOdd: runnerInfo.selectedOdd
        };
      }
      return prevMatch;
    });
    
    // On mobile, open bet slip when a runner is selected
    if (window.innerWidth < 768) {
      setIsBetSlipOpen(true);
    }
  };

  // Handle sport selection on mobile - show filtered events directly
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setMobileHeaderSport(sport);
    setSelectedMatch(null); // Clear match when changing sport
    setEntrySource(null);
    if (window.innerWidth < 768) {
      setMobileView('events'); // Show filtered events in premium card UI
    }
  };

  // Handle match selection on mobile
  const handleMatchSelect = (match) => {
    console.log('=== HANDLE MATCH SELECT (MOBILE) ===');
    console.log('Selected match:', match);
    setSelectedMatch(match);
    // Update URL with selected match info for persistence
    if (match && match.eventId) {
      console.log('Updating URL with match data:', {
        eventId: match.eventId,
        sportKey: match.sportKey || selectedSport?.key || '',
        eventName: match.eventName || '',
        viewType: 'live'
      });
      setSearchParams({
        eventId: match.eventId,
        sportKey: match.sportKey || selectedSport?.key || '',
        eventName: match.eventName || '',
        viewType: 'live' // default view type
      });
    }
    if (window.innerWidth < 768) {
      setMobileView('markets'); // Show markets
    }
  };
  
  // Handle match selection on desktop
  const handleMatchSelectDesktop = (match) => {
    console.log('=== HANDLE MATCH SELECT (DESKTOP) ===');
    console.log('Selected match:', match);
    setSelectedMatch(match);
    // Update URL with selected match info for persistence
    if (match && match.eventId) {
      console.log('Updating URL with match data:', {
        eventId: match.eventId,
        sportKey: match.sportKey || selectedSport?.key || '',
        eventName: match.eventName || '',
        viewType: 'live'
      });
      setSearchParams({
        eventId: match.eventId,
        sportKey: match.sportKey || selectedSport?.key || '',
        eventName: match.eventName || '',
        viewType: 'live' // default view type
      });
    }
  };

  // Reset market runner selection when a new match is selected
  useEffect(() => {
    if (selectedMatch) {
      // If there's no current runner selection or it's for a different match, clear the ref
      if (selectedRunnerRef.current && selectedRunnerRef.current.eventId !== selectedMatch.eventId) {
        selectedRunnerRef.current = null;
      }
      // If the new selected match doesn't have market info but we have a selection, apply it
      else if (selectedRunnerRef.current && !selectedMatch.selectedMarket) {
        setSelectedMatch(prevMatch => ({
          ...prevMatch,
          selectedMarket: selectedRunnerRef.current.selectedMarket,
          selectedRunner: selectedRunnerRef.current.selectedRunner,
          selectedOdd: selectedRunnerRef.current.selectedOdd
        }));
      }
    }
  }, [selectedMatch]);

  // Prepare info for RightEventInfoSection
  const rightEventInfo = selectedMatch && selectedMatch.selectedMarket 
    ? selectedMatch  // Use the full selected match with market info
    : (selectedMatch
      ? {
          ...selectedMatch,
          team1: selectedMatch.team1,
          team2: selectedMatch.team2,
          timeLabel: selectedMatch.openDate || selectedMatch.time || '',
        }
      : null);
     
  return (
    <div className="flex w-full h-[calc(100vh-60px)] bg-live-primary text-live-primary relative overflow-hidden">
      {/* Mobile Multi-Level Navigation */}
      <div className="md:hidden w-full h-full">
        {/* View: Sports List (Default) */}
        {mobileView === 'sports' && (
          <div className="w-full h-full bg-live-secondary p-4 overflow-y-auto md:hidden">
            <h2 className="text-lg font-bold text-live-primary mb-4">Select Sport</h2>
            <div className="grid grid-cols-3 gap-3 pb-20">
              {SPORTS.map((sport) => {
                const Icon = sport.icon;
                const colorClass = sport.color.split(' ').find(cls => cls.startsWith('bg-chart-')) || 'bg-gray-600';
                return (
                  <button
                    key={sport.key}
                    onClick={() => handleSportSelect(sport)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      selectedSport?.key === sport.key
                        ? `${colorClass} border-white shadow-lg`
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="text-[10px] font-medium text-center leading-tight">{sport.sportNames[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View: Events List */}
        {mobileView === 'events' && (
          <div className="w-full h-full bg-live-secondary flex flex-col md:hidden">
            <div className="flex items-center gap-3 p-3 border-b border-live bg-live-tertiary">
              <button
                onClick={() => {
                  if (entrySource === 'upcoming_matches') {
                    navigate(-1);
                    return;
                  }
                  setMobileView('sports');
                }}
                className="p-1 hover:bg-live-hover rounded-full transition-colors"
                aria-label="Back to sports"
              >
                <ChevronLeft className="w-6 h-6 text-live-primary" />
              </button>
              <h2 className="text-lg font-bold text-live-primary">
                {mobileHeaderSport?.sportNames?.[0] ? `${mobileHeaderSport.sportNames[0]} Events` : 'Events'}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LeftSidebarEventView
                setSelectedMatch={handleMatchSelect}
                setSelectedSport={setSelectedSport}
                selectedMatch={selectedMatch}
                onSelectedMatchOddsUpdate={updateSelectedMatchOdds}
                selectedSportFilter={mobileHeaderSport}
              />
            </div>
          </div>
        )}

        {/* View: Markets */}
        {mobileView === 'markets' && (
          <div className="w-full h-full flex flex-col md:hidden">
            <div className="flex items-center gap-3 p-3 border-b border-live bg-live-tertiary">
              <button
                onClick={() => {
                  if (entrySource === 'upcoming_matches') {
                    navigate(-1);
                    return;
                  }
                  setMobileView('events');
                }}
                className="p-1 hover:bg-live-hover rounded-full transition-colors"
                aria-label="Back to events"
              >
                <ChevronLeft className="w-6 h-6 text-live-primary" />
              </button>
              <h2 className="text-sm font-bold text-live-primary truncate">
                {selectedSport?.sportNames?.[0] ? `${selectedSport.sportNames[0]} Markets` : (selectedMatch?.eventName || 'Markets')}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MiddleGameDisplay 
                match={selectedMatch} 
                sport={selectedSport} 
                onRunnerSelect={handleRunnerSelect}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Left Section */}
      <div className="hidden md:flex md:w-[18%] min-w-[200px] max-w-[360px] overflow-y-auto">
        <LeftSidebarEventView
          setSelectedMatch={handleMatchSelectDesktop}
          setSelectedSport={setSelectedSport}
          selectedMatch={selectedMatch}
          onSelectedMatchOddsUpdate={updateSelectedMatchOdds}
        />
      </div>

      {/* Desktop Middle section: game display */}
      <div className="hidden md:flex flex-1 overflow-y-auto h-full w-full">
        <MiddleGameDisplay 
          match={selectedMatch} 
          sport={selectedSport} 
          onRunnerSelect={handleRunnerSelect}
        />
      </div>

      {/* Mobile Bottom Sheet - Bet Slip (shown on all mobile views) */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 bg-live-primary rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isBetSlipOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
      }`}
      style={{ maxHeight: '85vh' }}>
        {/* Handle Bar */}
        <div 
          className="flex items-center justify-center py-2 cursor-pointer"
          onClick={() => setIsBetSlipOpen(!isBetSlipOpen)}
        >
          <div className="w-12 h-1.5 bg-live-muted rounded-full"></div>
        </div>
        
        {/* Bet Slip Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-live">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-live-accent">BET SLIP</span>
            {selectedMatch && selectedMatch.selectedRunner && (
              <span className="text-xs bg-live-accent text-live-dark px-2 py-0.5 rounded-full">1</span>
            )}
          </div>
          <button
            onClick={() => setIsBetSlipOpen(false)}
            className="p-1 hover:bg-live-hover rounded-full transition-colors"
            aria-label="Close bet slip"
          >
            <X className="w-5 h-5 text-live-primary" />
          </button>
        </div>

        {/* Bet Slip Content */}
        <div className="h-[calc(85vh-120px)] overflow-y-auto">
          <RightEventInfoSection 
            selectedGame={rightEventInfo} 
            onLogin={() => setIsLoginModalOpen(true)}
            onRegister={() => setIsRegisterModalOpen(true)}
            isCompact={true}
          />
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:block w-[25%] min-w-[200px] max-w-[320px] overflow-y-auto h-full">
        <RightEventInfoSection 
          selectedGame={rightEventInfo} 
          onLogin={() => setIsLoginModalOpen(true)}
          onRegister={() => setIsRegisterModalOpen(true)}
        />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(false)
        }}
      />
    </div>
  );
}