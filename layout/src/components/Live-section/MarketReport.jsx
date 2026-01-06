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
      {/* Tab Navigation */}
      <div className="market-report-tabs bg-live-tertiary border-b border-live">
        <button 
          className={`tab bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary ${activeTab === 'All' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button 
          className={`tab bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary ${activeTab === 'Bets' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Bets')}
        >
          Bets
        </button>
        <button 
          className={`tab bg-live-tertiary text-live-secondary border-b-2 hover:bg-live-primary ${activeTab === 'Results' ? 'active bg-live-hover text-live-primary border-live-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('Results')}
        >
          Results
        </button>
      </div>

      {/* Filters Section */}
      <div className="market-report-filters bg-live-primary p-4 border-b border-live">
        <div className="filter-row">
          <div className="date-group">
            <div className="date-field">
              <label>Start Date</label>
              <div className="date-input-wrapper">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!startDate ? "text-muted-foreground" : "text-live-primary"}`}
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
            <div className="date-field">
              <label>End Date</label>
              <div className="date-input-wrapper">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!endDate ? "text-muted-foreground" : "text-live-primary"}`}
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
          
          {/* Filter Type and Value */}
          <div className="filter-group">
            <div className="filter-type">
              <label>Filter By</label>
              <select 
                className="w-full p-2 border border-live rounded bg-live-tertiary text-live-primary"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="market">Market ID</option>
                <option value="event">Event ID</option>
              </select>
            </div>
            
            {(filterType === 'market' || filterType === 'event') && (
              <div className="filter-value">
                <label>{filterType === 'market' ? 'Market ID' : 'Event ID'}</label>
                <input
                  type="text"
                  className="w-full p-2 border border-live rounded bg-live-tertiary text-live-primary"
                  placeholder={`Enter ${filterType} ID`}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button className="reset-btn bg-live-tertiary border border-live text-live-primary hover:bg-live-hover" onClick={resetFilters}>
              RESET
            </button>
            <button 
              className="show-btn bg-live-accent border border-live-accent text-live-dark hover:bg-live-secondary font-semibold"
              onClick={handleFilterSubmit}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>

      {/* Market Report Content */}
      <div className="market-report-content bg-live-tertiary">
        <div className="report-table w-full overflow-x-auto">
          {marketReportState.loading ? (
            <div className="loading-placeholder p-4 text-center text-live-primary">
              Loading market report...
            </div>
          ) : marketReportState.error ? (
            <div className="error-placeholder p-4 text-center text-red-500">
              Error loading market report: {marketReportState.error}
            </div>
          ) : reportData.length > 0 ? (
            <table className="min-w-full bg-live-tertiary">
              <thead className="bg-live-primary">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Bet Details</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Credit</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Debit</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Balance</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Time</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-live-primary border-b border-live">ID</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((entry, index) => (
                  <tr key={index} className="border-b border-live hover:bg-live-primary">
                    <td className="py-3 px-4 text-sm text-live-primary">{entry.description || entry.betDetails || '-'}</td>
                    <td className="py-3 px-4 text-sm text-green-500">{entry.creditAmount ? `+${entry.creditAmount}` : '-'}</td>
                    <td className="py-3 px-4 text-sm text-red-500">{entry.debitAmount ? `-${entry.debitAmount}` : '-'}</td>
                    <td className="py-3 px-4 text-sm text-live-primary">{entry.runningBalance || '-'}</td>
                    <td className="py-3 px-4 text-sm text-live-primary">{formatDateTime(entry.timestamp)}</td>
                    <td className={`py-3 px-4 text-sm ${getTransactionTypeColor(entry.type)}`}>{entry.type || '-'}</td>
                    <td className="py-3 px-4 text-sm text-live-primary font-mono">{entry.betId || entry.resultTxId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-report-placeholder p-4 text-center text-live-muted">
              No market report found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketReport;