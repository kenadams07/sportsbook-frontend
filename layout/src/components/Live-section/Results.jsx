import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBets } from '../../redux/Action/userBetsActions';
import { fetchMatchResults } from '../../redux/Action/matchResultsActions';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';

const Results = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.GetUserData);
  const userBetsState = useSelector(state => state.UserBets);
  const matchResultsState = useSelector(state => state.MatchResults);

  const [activeTab, setActiveTab] = useState('Live');
  const [startDate, setStartDate] = useState(new Date(2025, 7, 22)); // August is month 7 (0-indexed)
  const [endDate, setEndDate] = useState(new Date(2025, 7, 22));
  const [expandedEvents, setExpandedEvents] = useState({});

  // Fetch user bets when component mounts and userData is available
  useEffect(() => {
    if (userData?._id) {
      // Fetch all user bets using the user ID from Redux state (which comes from localStorage)
      // Not passing eventId to fetch all bets for the user
      dispatch(fetchUserBets(userData._id));
    }
  }, [dispatch, userData]);

  // Fetch match results when user bets are loaded
  useEffect(() => {
    if (userBetsState.bets.length > 0 && !userBetsState.loading) {
      // Extract eventIds, sportIds, and marketIds from user bets and fetch match results for each
      const uniqueBets = {};
      userBetsState.bets.forEach(bet => {
        if (bet.eventId && bet.sportId && bet.marketId) {
          // Create a unique key for each bet combination
          const key = `${bet.eventId}-${bet.sportId}-${bet.marketId}`;
          if (!uniqueBets[key]) {
            uniqueBets[key] = bet;
            dispatch(fetchMatchResults(bet.eventId, bet.sportId, bet.marketId, userData._id));
          }
        }
      });
    }
  }, [dispatch, userBetsState]);

  const toggleEvent = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const resetFilters = () => {
    setStartDate(new Date(2025, 7, 22));
    setEndDate(new Date(2025, 7, 22));
  };

  // Helper function to extract event data from match results
  const getEventData = () => {
    if (!matchResultsState.results || matchResultsState.results.length === 0) {
      return [];
    }

    // Transform match results into event data, merging markets for the same event
    const eventMap = {};
    matchResultsState.results.forEach(result => {
      let event = null;
      
      // Handle the API response structure
      if (result?.data?.event) {
        event = { ...result.data.event };
        // Deep copy markets to avoid mutation
        if (event.markets) {
          event.markets = { ...event.markets };
          Object.keys(event.markets).forEach(marketType => {
            if (Array.isArray(event.markets[marketType])) {
              event.markets[marketType] = event.markets[marketType].map(market => ({ ...market, runners: Array.isArray(market.runners) ? market.runners.map(runner => ({ ...runner })) : market.runners }));
            }
          });
        }
      }
      // Handle direct event data
      else if (result?.event) {
        event = { ...result.event };
        // Deep copy markets to avoid mutation
        if (event.markets) {
          event.markets = { ...event.markets };
          Object.keys(event.markets).forEach(marketType => {
            if (Array.isArray(event.markets[marketType])) {
              event.markets[marketType] = event.markets[marketType].map(market => ({ ...market, runners: Array.isArray(market.runners) ? market.runners.map(runner => ({ ...runner })) : market.runners }));
            }
          });
        }
      }
      
      if (event) {
        if (eventMap[event.eventId]) {
          // Create a new event object to avoid mutation
          const updatedEvent = { ...eventMap[event.eventId] };
          // Deep copy markets to avoid mutation
          updatedEvent.markets = { ...updatedEvent.markets };
          
          // Merge markets if event already exists
          if (event.markets) {
            // Iterate through all market types in the new result
            Object.keys(event.markets).forEach(marketType => {
              if (!updatedEvent.markets[marketType]) {
                // If this market type doesn't exist yet, add it
                updatedEvent.markets[marketType] = [];
              }
              // Add the new markets to the existing market type
              updatedEvent.markets[marketType] = [
                ...updatedEvent.markets[marketType],
                ...event.markets[marketType]
              ];
            });
          }
          eventMap[event.eventId] = updatedEvent;
        } else {
          // Add new event
          eventMap[event.eventId] = event;
          // Ensure markets is properly initialized
          if (!eventMap[event.eventId].markets) {
            eventMap[event.eventId].markets = {};
          }
        }
      }
    });

    // Convert map to array
    return Object.values(eventMap);
  };

  const eventData = getEventData();
 
  return (
    <div className="results-container bg-live-tertiary text-live-primary min-h-screen">
      {/* Tab Navigation - Mobile Optimized */}
      <div className="results-tabs bg-live-tertiary border-b border-live flex">
        <button 
          className={`tab flex-1 bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary text-xs sm:text-sm py-2 sm:py-3 ${activeTab === 'Live' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Live')}
        >
          Live
        </button>
        <button 
          className={`tab flex-1 bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary text-xs sm:text-sm py-2 sm:py-3 ${activeTab === 'Finished' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Finished')}
        >
          Finished
        </button>
      </div>

      {/* Filters Section - Mobile Responsive */}
      <div className="results-filters bg-live-primary p-3 sm:p-4 border-b border-live">
        <div className="flex flex-col gap-3">
          {/* Row 1: Dates */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Date */}
            <div className="date-field w-full">
              <label className="text-xs font-medium mb-1.5 block text-live-secondary uppercase tracking-wider">Start Date</label>
              <div className="date-input-wrapper w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between text-left font-normal text-xs h-10 bg-live-tertiary border-live hover:bg-live-hover ${!startDate ? "text-muted-foreground" : "text-live-primary"}`}
                    >
                      <span className="truncate">
                        {startDate ? startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Select'}
                      </span>
                      <span className="calendar-icon text-live-secondary opacity-70">📅</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-live-primary border-live" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="bg-live-primary text-live-primary rounded-md border-live"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* End Date */}
            <div className="date-field w-full">
              <label className="text-xs font-medium mb-1.5 block text-live-secondary uppercase tracking-wider">End Date</label>
              <div className="date-input-wrapper w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between text-left font-normal text-xs h-10 bg-live-tertiary border-live hover:bg-live-hover ${!endDate ? "text-muted-foreground" : "text-live-primary"}`}
                    >
                       <span className="truncate">
                        {endDate ? endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Select'}
                      </span>
                      <span className="calendar-icon text-live-secondary opacity-70">📅</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-live-primary border-live" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="bg-live-primary text-live-primary rounded-md border-live"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Row 2: Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="reset-btn w-full h-10 bg-live-tertiary border border-live text-live-primary hover:bg-live-hover text-xs font-semibold px-3 rounded transition-all duration-200 active:scale-95 whitespace-nowrap" 
              onClick={resetFilters}
            >
              RESET
            </button>
            <button 
              className="show-btn w-full h-10 bg-live-accent text-live-dark hover:brightness-110 transition-all duration-200 font-bold text-xs px-3 rounded shadow-sm active:scale-95 whitespace-nowrap"
            >
              SHOW
            </button>
          </div>
        </div>
      </div>

      {/* Results Content - Mobile Optimized */}
      <div className="results-content flex flex-col md:flex-row min-h-[calc(100vh-200px)] bg-live-tertiary">
        {/* Leagues list - Full width on mobile, half on desktop */}
        <div className="leagues-list w-full md:w-1/2 bg-live-tertiary md:border-r border-live overflow-y-auto p-2 sm:p-0">
          {eventData.length > 0 ? (
            <div className="flex flex-col gap-2 sm:gap-0">
              {eventData.map((event) => (
                <div key={event.eventId} className="league-item bg-live-primary rounded-lg sm:rounded-none border border-live sm:border-0 sm:border-b last:border-0 overflow-hidden shadow-sm sm:shadow-none transition-all duration-200">
                  <div 
                    className={`league-header flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200 ${expandedEvents[event.eventId] ? 'bg-live-secondary/10' : 'hover:bg-live-secondary/5'}`}
                    onClick={() => toggleEvent(event.eventId)}
                  >
                    <div className="league-info flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-live-tertiary border border-live shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                         <span className="league-icon text-live-accent text-sm">⚽</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="league-name text-live-primary text-sm font-bold truncate leading-tight">{event.eventName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-live-secondary px-1.5 py-0.5 bg-live-tertiary rounded border border-live/50">
                             {event.openDate ? new Date(event.openDate).toLocaleDateString() : 'Today'}
                          </span>
                          <span className="text-[10px] text-live-secondary truncate">{event.openDate ? new Date(event.openDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Live'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`expand-arrow text-live-secondary w-6 h-6 flex items-center justify-center rounded-full bg-live-tertiary border border-live/30 transition-all duration-300 flex-shrink-0 ml-2 ${expandedEvents[event.eventId] ? 'rotate-180 bg-live-accent text-live-dark border-live-accent' : 'group-hover:bg-live-hover'}`}>
                      ▼
                    </span>
                  </div>
                  {expandedEvents[event.eventId] && (
                    <div className="league-content bg-live-tertiary/50 p-3 border-t border-live animate-in slide-in-from-top-2 duration-200">
                      {event.markets && Object.keys(event.markets).some(marketType => event.markets[marketType] && event.markets[marketType].length > 0) ? (
                        Object.entries(event.markets).map(([marketType, marketList]) => 
                          marketList && marketList.length > 0 ? (
                            marketList.map((market, index) => (
                              <div key={`${event.eventId}-${market.marketId}`} className="mb-3 last:mb-0 bg-live-primary rounded-lg border border-live p-3 shadow-sm">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-live/50">
                                  <div className="w-1 h-3 bg-live-accent rounded-full"></div>
                                  <div className="font-bold text-live-primary text-xs uppercase tracking-wider">{market.marketName}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {market.runners && market.runners.map((runner, runnerIndex) => (
                                    <div 
                                      key={`${event.eventId}-${market.marketId}-${runner.runnerId}`} 
                                      className={`relative p-2.5 rounded-md text-center text-xs transition-all duration-200 border ${
                                        runner.result === 'won' 
                                          ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                                          : runner.result === 'lost'
                                          ? 'bg-red-500/10 text-red-500 border-red-500/30'
                                          : 'bg-live-tertiary text-live-primary border-live'
                                      }`}
                                    >
                                      <div className="font-bold truncate mb-1.5">{runner.runnerName}</div>
                                      <div className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full inline-block ${
                                         runner.result === 'won' ? 'bg-green-500/20' : runner.result === 'lost' ? 'bg-red-500/20' : 'bg-live-secondary/20'
                                      }`}>
                                        {runner.result ? runner.result : 'Pending'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : null
                        )
                      ) : (
                        <div className="no-matches flex flex-col items-center justify-center py-6 text-live-muted">
                          <span className="text-2xl mb-2 opacity-20">📊</span>
                          <span className="text-xs font-medium">No market data available</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-placeholder p-4 text-center text-live-muted text-xs sm:text-sm">
              {matchResultsState.loading ? (
                <div>Loading match results...</div>
              ) : matchResultsState.error ? (
                <div>Error loading match results: {matchResultsState.error}</div>
              ) : (
                <div>No match results found</div>
              )}
            </div>
          )}
        </div>
        
        {/* Results display - Hidden on mobile, shown on desktop */}
        <div className="results-display hidden md:flex flex-1 bg-live-tertiary items-center justify-center">
          <div className="no-results text-live-muted text-base sm:text-lg font-medium">
            No Results
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;