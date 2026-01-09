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
      <div className="results-filters bg-live-primary p-2 sm:p-4 border-b border-live">
        <div className="filter-row flex flex-col gap-3">
          {/* Date filters - Stack on mobile */}
          <div className="date-group flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="date-field flex-1">
              <label className="text-xs sm:text-sm mb-1 block">Start Date</label>
              <div className="date-input-wrapper">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal text-xs sm:text-sm ${!startDate ? "text-muted-foreground" : "text-live-primary"}`}
                    >
                      {startDate ? startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Select date'}
                      <span className="calendar-icon text-live-secondary ml-2">📅</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="date-field flex-1">
              <label className="text-xs sm:text-sm mb-1 block">End Date</label>
              <div className="date-input-wrapper">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal text-xs sm:text-sm ${!endDate ? "text-muted-foreground" : "text-live-primary"}`}
                    >
                      {endDate ? endDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Select date'}
                      <span className="calendar-icon text-live-secondary ml-2">📅</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          {/* Action buttons - Stack on mobile */}
          <div className="action-buttons flex gap-2">
            <button className="reset-btn flex-1 sm:flex-none bg-live-tertiary border border-live text-live-primary hover:bg-live-hover text-xs sm:text-sm px-3 sm:px-4 py-2 rounded" onClick={resetFilters}>
              RESET
            </button>
            <button className="show-btn flex-1 sm:flex-none bg-live-accent border border-live-accent text-live-dark hover:bg-live-secondary font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded">
              SHOW
            </button>
          </div>
        </div>
      </div>

      {/* Results Content - Mobile Optimized */}
      <div className="results-content flex flex-col md:flex-row min-h-screen bg-live-tertiary">
        {/* Leagues list - Full width on mobile, half on desktop */}
        <div className="leagues-list w-full md:w-1/2 bg-live-tertiary border-b md:border-r md:border-b-0 border-live overflow-y-auto">
          {eventData.length > 0 ? (
            eventData.map((event) => (
              <div key={event.eventId} className="league-item border-b border-live">
                <div 
                  className="league-header flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-live-primary transition-colors"
                  onClick={() => toggleEvent(event.eventId)}
                >
                  <div className="league-info flex items-center gap-2 flex-1 min-w-0">
                    <span className="league-icon text-live-accent text-sm sm:text-base">⚽</span>
                    <span className="league-name text-live-primary text-xs sm:text-sm font-medium truncate">{event.eventName}</span>
                  </div>
                  <span className={`expand-arrow text-live-secondary text-xs transition-transform duration-300 flex-shrink-0 ml-2 ${expandedEvents[event.eventId] ? 'expanded rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                {expandedEvents[event.eventId] && (
                  <div className="league-content bg-live-primary p-2 sm:p-4 border-t border-live">
                    {event.markets && Object.keys(event.markets).some(marketType => event.markets[marketType] && event.markets[marketType].length > 0) ? (
                      Object.entries(event.markets).map(([marketType, marketList]) => 
                        marketList && marketList.length > 0 ? (
                          marketList.map((market, index) => (
                            <div key={`${event.eventId}-${market.marketId}`} className="mb-3">
                              <div className="font-medium text-live-primary mb-2 text-xs sm:text-sm">{market.marketName}</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {market.runners && market.runners.map((runner, runnerIndex) => (
                                  <div 
                                    key={`${event.eventId}-${market.marketId}-${runner.runnerId}`} 
                                    className={`p-2 rounded text-center text-xs sm:text-sm ${
                                      runner.result === 'won' 
                                        ? 'bg-green-100 text-green-800 border border-green-300' 
                                        : runner.result === 'lost'
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                                    }`}
                                  >
                                    <div className="font-medium truncate">{runner.runnerName}</div>
                                    <div className="text-[10px] sm:text-xs capitalize">
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
                      <div className="no-matches text-live-muted text-xs sm:text-sm text-center py-2">No market data available</div>
                    )}
                  </div>
                )}
              </div>
            ))
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