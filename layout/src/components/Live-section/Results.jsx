import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBets } from '../../redux/Action/userBetsActions';
import { fetchMatchResults } from '../../redux/Action/matchResultsActions';

const Results = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.GetUserData);
  const userBetsState = useSelector(state => state.UserBets);
  const matchResultsState = useSelector(state => state.MatchResults);

  const [activeTab, setActiveTab] = useState('Live');
  const [startDate, setStartDate] = useState('22.08.2025');
  const [endDate, setEndDate] = useState('22.08.2025');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedCompetition, setSelectedCompetition] = useState('All');
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
            dispatch(fetchMatchResults(bet.eventId, bet.sportId, bet.marketId));
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
    setStartDate('22.08.2025');
    setEndDate('22.08.2025');
    setSelectedSport('Football');
    setSelectedCompetition('All');
  };

  // Helper function to extract event data from match results
  const getEventData = () => {
    if (!matchResultsState.results || matchResultsState.results.length === 0) {
      return [];
    }

    // Transform match results into event data, merging markets for the same event
    const eventMap = {};
    matchResultsState.results.forEach(result => {
      // Handle the API response structure
      if (result?.data?.event) {
        const event = result.data.event;
        if (eventMap[event.eventId]) {
          // Merge markets if event already exists
          if (event.markets && event.markets.matchOdds) {
            eventMap[event.eventId].markets.matchOdds = [
              ...eventMap[event.eventId].markets.matchOdds,
              ...event.markets.matchOdds
            ];
          }
        } else {
          // Add new event
          eventMap[event.eventId] = { ...event };
        }
      }
      // Handle direct event data
      else if (result?.event) {
        const event = result.event;
        if (eventMap[event.eventId]) {
          // Merge markets if event already exists
          if (event.markets && event.markets.matchOdds) {
            eventMap[event.eventId].markets.matchOdds = [
              ...eventMap[event.eventId].markets.matchOdds,
              ...event.markets.matchOdds
            ];
          }
        } else {
          // Add new event
          eventMap[event.eventId] = { ...event };
        }
      }
    });

    // Convert map to array
    return Object.values(eventMap);
  };

  const eventData = getEventData();

  return (
    <div className="results-container bg-live-tertiary text-live-primary min-h-screen">
      {/* Tab Navigation */}
      <div className="results-tabs bg-live-tertiary border-b border-live">
        <button 
          className={`tab bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary ${activeTab === 'Live' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Live')}
        >
          Live
        </button>
        <button 
          className={`tab bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary ${activeTab === 'Finished' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Finished')}
        >
          Finished
        </button>
      </div>

      {/* Filters Section */}
      <div className="results-filters bg-live-primary p-4 border-b border-live">
        <div className="filter-row">
          <div className="date-group">
            <div className="date-field">
              <label>Start Date</label>
              <div className="date-input-wrapper">
                <input 
                  type="text" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="calendar-icon text-live-secondary">📅</span>
              </div>
            </div>
            <div className="date-field">
              <label>End Date</label>
              <div className="date-input-wrapper">
                <input 
                  type="text" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <span className="calendar-icon text-live-secondary">📅</span>
              </div>
            </div>
          </div>
          
          <div className="dropdown-group">
            <div className="dropdown-field">
              <label>Sport</label>
              <select 
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
            <div className="dropdown-field">
              <label>Competition</label>
              <select 
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Premier League">Premier League</option>
                <option value="Champions League">Champions League</option>
              </select>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="reset-btn bg-live-tertiary border border-live text-live-primary hover:bg-live-hover" onClick={resetFilters}>
              RESET
            </button>
            <button className="show-btn bg-live-accent border border-live-accent text-live-dark hover:bg-live-secondary font-semibold">
              SHOW
            </button>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="results-content flex min-h-screen bg-live-tertiary">
        <div className="leagues-list w-1/2 bg-live-tertiary border-r border-live overflow-y-auto">
          {eventData.length > 0 ? (
            eventData.map((event) => (
              <div key={event.eventId} className="league-item border-b border-live">
                <div 
                  className="league-header flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-live-primary transition-colors"
                  onClick={() => toggleEvent(event.eventId)}
                >
                  <div className="league-info flex items-center gap-2">
                    <span className="league-icon text-live-accent">⚽</span>
                    <span className="league-name text-live-primary text-sm font-medium">{event.eventName}</span>
                  </div>
                  <span className={`expand-arrow text-live-secondary text-xs transition-transform duration-300 ${expandedEvents[event.eventId] ? 'expanded rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
                {expandedEvents[event.eventId] && (
                  <div className="league-content bg-live-primary p-4 border-t border-live">
                    {event.markets && event.markets.matchOdds && event.markets.matchOdds.length > 0 ? (
                      event.markets.matchOdds.map((market, index) => (
                        <div key={`${event.eventId}-${market.marketId}`} className="mb-3">
                          <div className="font-medium text-live-primary mb-2">{market.marketName}</div>
                          <div className="grid grid-cols-2 gap-2">
                            {market.runners && market.runners.map((runner, runnerIndex) => (
                              <div 
                                key={`${event.eventId}-${market.marketId}-${runner.runnerId}`} 
                                className={`p-2 rounded text-center text-sm ${
                                  runner.result === 'won' 
                                    ? 'bg-green-100 text-green-800 border border-green-300' 
                                    : runner.result === 'lost'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                                }`}
                              >
                                <div className="font-medium">{runner.runnerName}</div>
                                <div className="text-xs capitalize">
                                  {runner.result ? runner.result : 'Pending'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-matches text-live-muted text-sm text-center py-2">No market data available</div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results-placeholder p-4 text-center text-live-muted">
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
        
        <div className="results-display flex-1 bg-live-tertiary flex items-center justify-center">
          <div className="no-results text-live-muted text-lg font-medium">
            No Results
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;