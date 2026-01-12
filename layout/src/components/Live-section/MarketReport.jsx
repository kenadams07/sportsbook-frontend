import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMarketReport } from '../../redux/Action/marketReportActions';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';

const MarketReport = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.GetUserData);
  const marketReportState = useSelector(state => state.MarketReport);

  const [activeTab, setActiveTab] = useState('All');
  const [startDate, setStartDate] = useState(new Date(2025, 7, 22)); // August is month 7 (0-indexed)
  const [endDate, setEndDate] = useState(new Date(2025, 7, 22));
  const [filterType, setFilterType] = useState('all'); // 'all', 'market', 'event'
  const [filterValue, setFilterValue] = useState('');

  // Fetch market report when component mounts and userData is available
  useEffect(() => {
    if (userData?._id) {
      // Fetch all market reports for the user initially
      dispatch(fetchMarketReport(userData._id));
    }
  }, [dispatch, userData]);

  const handleFilterSubmit = () => {
    if (userData?._id) {
      let marketId = null;
      let eventId = null;

      if (filterType === 'market') {
        marketId = filterValue;
      } else if (filterType === 'event') {
        eventId = filterValue;
      }

      dispatch(fetchMarketReport(userData._id, marketId, eventId));
    }
  };

  const resetFilters = () => {
    setFilterType('all');
    setFilterValue('');
    setStartDate(new Date(2025, 7, 22));
    setEndDate(new Date(2025, 7, 22));
    
    if (userData?._id) {
      dispatch(fetchMarketReport(userData._id));
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'bet':
        return 'text-yellow-500';
      case 'result':
        return 'text-green-500';
      default:
        return 'text-live-primary';
    }
  };

  const reportData = Array.isArray(marketReportState.report) ? marketReportState.report : marketReportState.report?.data || [];

  return (
    <div className="market-report-container bg-live-tertiary text-live-primary min-h-screen">
      {/* Tab Navigation - Mobile Optimized */}
      <div className="market-report-tabs bg-live-tertiary border-b border-live flex overflow-x-auto scrollbar-hide">
        <button 
          className={`tab flex-1 min-w-[80px] bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary text-xs sm:text-sm py-2 sm:py-3 whitespace-nowrap ${activeTab === 'All' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button 
          className={`tab flex-1 min-w-[80px] bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary text-xs sm:text-sm py-2 sm:py-3 whitespace-nowrap ${activeTab === 'Bets' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Bets')}
        >
          Bets
        </button>
        <button 
          className={`tab flex-1 min-w-[80px] bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary text-xs sm:text-sm py-2 sm:py-3 whitespace-nowrap ${activeTab === 'Results' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Results')}
        >
          Results
        </button>
      </div>

      {/* Filters Section - Mobile Responsive */}
      <div className="market-report-filters bg-live-primary p-3 sm:p-4 border-b border-live">
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
          
          {/* Row 2: Filter Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            {/* Filter Type */}
            <div className={`filter-type w-full ${(filterType === 'all') ? 'col-span-2' : ''}`}>
              <label className="text-xs font-medium mb-1.5 block text-live-secondary uppercase tracking-wider">Filter By</label>
              <div className="relative">
                <select 
                  className="w-full h-10 pl-3 pr-8 border border-live rounded bg-live-tertiary text-live-primary text-xs focus:outline-none focus:border-live-accent appearance-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="market">Market ID</option>
                  <option value="event">Event ID</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-live-secondary">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            {/* Filter Value - Conditional */}
            {(filterType === 'market' || filterType === 'event') && (
              <div className="filter-value w-full animate-in fade-in zoom-in duration-200">
                <label className="text-xs font-medium mb-1.5 block text-live-secondary uppercase tracking-wider">{filterType === 'market' ? 'Market ID' : 'Event ID'}</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-live rounded bg-live-tertiary text-live-primary text-xs focus:outline-none focus:border-live-accent placeholder:text-live-muted"
                  placeholder={`Enter ID`}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}
          </div>
          
          {/* Row 3: Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="reset-btn w-full h-10 bg-live-tertiary border border-live text-live-primary hover:bg-live-hover text-xs font-semibold px-3 rounded transition-all duration-200 active:scale-95 whitespace-nowrap" 
              onClick={resetFilters}
            >
              RESET
            </button>
            <button 
              className="show-btn w-full h-10 bg-live-accent text-live-dark hover:brightness-110 transition-all duration-200 font-bold text-xs px-3 rounded shadow-sm active:scale-95 whitespace-nowrap"
              onClick={handleFilterSubmit}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>

      {/* Market Report Content - Mobile Optimized with Cards, Desktop Table */}
      <div className="market-report-content bg-live-tertiary min-h-[calc(100vh-250px)]">
        <div className="w-full">
          {marketReportState.loading ? (
            <div className="loading-placeholder p-8 text-center text-live-primary flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-live-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium animate-pulse">Loading market report...</span>
            </div>
          ) : marketReportState.error ? (
            <div className="error-placeholder p-4 m-4 text-center bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs sm:text-sm">
              Error loading market report: {marketReportState.error}
            </div>
          ) : reportData.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-3 p-3">
                {reportData.map((entry, index) => (
                  <div key={index} className="bg-live-primary rounded-lg border border-live p-3 shadow-sm active:scale-[0.99] transition-transform">
                    <div className="flex justify-between items-start mb-3 border-b border-live/50 pb-2">
                      <div className="flex flex-col gap-1">
                         <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${
                           entry.type === 'bet' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                           entry.type === 'result' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                           'bg-live-tertiary text-live-secondary border border-live'
                         }`}>
                           {entry.type || 'Transaction'}
                         </span>
                         <span className="text-[9px] text-live-secondary font-mono">#{entry.betId || entry.resultTxId || 'N/A'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-live-primary font-bold">{formatDateTime(entry.timestamp).split(',')[0]}</div>
                        <div className="text-[10px] text-live-secondary">{formatDateTime(entry.timestamp).split(',')[1]}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs text-live-primary font-medium leading-relaxed">
                        {entry.description || entry.betDetails || 'No description available'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 bg-live-tertiary rounded-lg p-2.5 border border-live/50">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-live-secondary uppercase tracking-wider font-bold mb-0.5">Credit</span>
                        <span className={`text-xs font-bold ${entry.creditAmount ? 'text-green-500' : 'text-live-muted/50'}`}>
                          {entry.creditAmount ? `+${entry.creditAmount}` : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center border-l border-r border-live/50">
                        <span className="text-[9px] text-live-secondary uppercase tracking-wider font-bold mb-0.5">Debit</span>
                        <span className={`text-xs font-bold ${entry.debitAmount ? 'text-red-500' : 'text-live-muted/50'}`}>
                          {entry.debitAmount ? `-${entry.debitAmount}` : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-live-secondary uppercase tracking-wider font-bold mb-0.5">Balance</span>
                        <span className="text-xs font-bold text-live-primary">
                          {entry.runningBalance || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-live-tertiary">
                  <thead className="bg-live-primary sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Bet Details</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Credit</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Debit</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Balance</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Time</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">Type</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-live-secondary uppercase tracking-wider border-b border-live whitespace-nowrap">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((entry, index) => (
                      <tr key={index} className="border-b border-live hover:bg-live-primary transition-colors">
                        <td className="py-3 px-4 text-sm text-live-primary">{entry.description || entry.betDetails || '-'}</td>
                        <td className="py-3 px-4 text-sm text-green-500 font-medium whitespace-nowrap">{entry.creditAmount ? `+${entry.creditAmount}` : '-'}</td>
                        <td className="py-3 px-4 text-sm text-red-500 font-medium whitespace-nowrap">{entry.debitAmount ? `-${entry.debitAmount}` : '-'}</td>
                        <td className="py-3 px-4 text-sm text-live-primary font-bold whitespace-nowrap">{entry.runningBalance || '-'}</td>
                        <td className="py-3 px-4 text-sm text-live-muted whitespace-nowrap">{formatDateTime(entry.timestamp)}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.type === 'bet' ? 'bg-yellow-500/10 text-yellow-500' : 
                            entry.type === 'result' ? 'bg-green-500/10 text-green-500' : 
                            'bg-live-secondary text-live-primary'
                          }`}>
                            {entry.type || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-live-muted font-mono whitespace-nowrap">{entry.betId || entry.resultTxId || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="no-report-placeholder p-4 text-center text-live-muted text-xs sm:text-sm">
              No market report found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketReport;