import React, { useState } from 'react';

const Results = () => {
  const [activeTab, setActiveTab] = useState('Live');
  const [startDate, setStartDate] = useState('22.08.2025');
  const [endDate, setEndDate] = useState('22.08.2025');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedCompetition, setSelectedCompetition] = useState('All');
  const [expandedLeagues, setExpandedLeagues] = useState({});

  const leagues = [
    { id: 1, name: 'Calcutta Premier Division (India)', icon: '⚽', country: 'IN' },
    { id: 2, name: 'Club Friendlies (World)', icon: '⚽', country: 'WW' },
    { id: 3, name: 'Copa Libertadores (South America)', icon: '⚽', country: 'SA' },
    { id: 4, name: 'Copa Sudamericana (South America)', icon: '⚽', country: 'SA' },
    { id: 5, name: 'J1 League (Japan)', icon: '⚽', country: 'JP' },
    { id: 6, name: 'LFP - Women (Colombia)', icon: '⚽', country: 'CO' },
    { id: 7, name: 'Liga Pro (Russia)', icon: '⚽', country: 'RU' },
    { id: 8, name: 'Liga Prom (Panama)', icon: '⚽', country: 'PA' },
    { id: 9, name: 'Mizoram Premier League (India)', icon: '⚽', country: 'IN' },
    { id: 10, name: 'MLS Next Pro (USA)', icon: '⚽', country: 'US' },
    { id: 11, name: 'MNL 1 (Myanmar)', icon: '⚽', country: 'MM' },
    { id: 12, name: 'NB I - Women (Hungary)', icon: '⚽', country: 'HU' },
    { id: 13, name: 'NCAA (North America)', icon: '⚽', country: 'NA' },
    { id: 14, name: 'Northern Territory Premier League (Australia)', icon: '⚽', country: 'AU' },
    { id: 15, name: 'NPL NSW (Australia)', icon: '⚽', country: 'AU' }
  ];

  const toggleLeague = (leagueId) => {
    setExpandedLeagues(prev => ({
      ...prev,
      [leagueId]: !prev[leagueId]
    }));
  };

  const resetFilters = () => {
    setStartDate('22.08.2025');
    setEndDate('22.08.2025');
    setSelectedSport('Football');
    setSelectedCompetition('All');
  };

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
          {leagues.map((league) => (
            <div key={league.id} className="league-item border-b border-live">
              <div 
                className="league-header flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-live-primary transition-colors"
                onClick={() => toggleLeague(league.id)}
              >
                <div className="league-info flex items-center gap-2">
                  <span className="league-icon text-live-accent">{league.icon}</span>
                  <span className="league-name text-live-primary text-sm font-medium">{league.name}</span>
                </div>
                <span className={`expand-arrow text-live-secondary text-xs transition-transform duration-300 ${expandedLeagues[league.id] ? 'expanded rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              {expandedLeagues[league.id] && (
                <div className="league-content bg-live-primary p-4 border-t border-live">
                  <div className="no-matches text-live-muted text-sm text-center py-2">No matches available</div>
                </div>
              )}
            </div>
          ))}
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