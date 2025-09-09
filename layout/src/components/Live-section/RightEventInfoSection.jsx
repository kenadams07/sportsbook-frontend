"use client";

import { useState, useEffect, useRef } from 'react';

// Utility function to format timestamp to readable date and time
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(parseInt(timestamp));
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  // Format options for date and time
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleDateString('en-US', options);
};

// Function to extract W1 odds from markets data
const extractW1Odds = (markets) => {
  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];
  const r0 = mo?.runners?.[0];
  const w1 = r0?.backPrices?.[0]?.price;
  return typeof w1 === "number" ? w1.toFixed(2) : '-';
};

// Function to extract W2 odds from markets data
const extractW2Odds = (markets) => {
  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];
  const r1 = mo?.runners?.[1];
  const w2 = r1?.backPrices?.[0]?.price;
  return typeof w2 === "number" ? w2.toFixed(2) : '-';
};

export default function RightEventInfoSection({ selectedGame, onLogin, onRegister, isCompact = false }) {
  const [oddsOption, setOddsOption] = useState('always ask');
  const [isOpen, setIsOpen] = useState(false);
  const [betAmounts, setBetAmounts] = useState([500, 1000, 5000]); // Updated bet amounts
  const [editableIndex, setEditableIndex] = useState(null); // Track which bet amount is being edited
  const [editValue, setEditValue] = useState(''); // Track the value being edited
  const [isEditingMode, setIsEditingMode] = useState(false); // Track if we're in editing mode
  const [stakeValue, setStakeValue] = useState(''); // Track the stake input value
  const editInputRef = useRef(null); // Ref for the edit input
  const containerRef = useRef(null); // Ref for the container to detect clicks outside

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle clicks outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Clicked outside, exit edit mode
        setIsEditingMode(false);
        setEditableIndex(null);
        setEditValue('');
      }
    };

    if (isEditingMode) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingMode]);

  // Focus the input when it becomes editable
  useEffect(() => {
    if (editableIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editableIndex]);

  // Handle edit submission
  const handleEditSubmit = (index) => {
    if (editValue && !isNaN(editValue) && Number(editValue) > 0) {
      const newBetAmounts = [...betAmounts];
      newBetAmounts[index] = Number(editValue);
      setBetAmounts(newBetAmounts);
    }
    setEditableIndex(null);
    setEditValue('');
    // Exit edit mode after submission
    setIsEditingMode(false);
  };

  // Handle key press in edit input
  const handleEditKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleEditSubmit(index);
    } else if (e.key === 'Escape') {
      setEditableIndex(null);
      setEditValue('');
      // Exit edit mode on escape
      setIsEditingMode(false);
    }
  };

  // Handle chip click to set stake value
  const handleChipClick = (amount) => {
    setStakeValue(amount.toString());
  };

  // Handle stake input change
  const handleStakeChange = (e) => {
    setStakeValue(e.target.value);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    // Reset any active editing when toggling mode
    if (isEditingMode) {
      setEditableIndex(null);
      setEditValue('');
    }
  };

  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center h-full text-live-muted text-sm bg-gradient-to-b from-live-tertiary to-live-secondary rounded p-4 shadow-md">
        Select a game to see details
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="p-2.5 m-1.5 bg-live-primary rounded-lg border border-live-accent shadow-live flex flex-col gap-2 text-live-primary">
        {/* MY TEAMS Section */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-live-primary">MY TEAMS</h3>
          <button className="w-full flex items-center gap-1.5 bg-live-primary hover:bg-live-hover px-2 py-1.5 rounded text-xs">
            <span className="text-live-accent">★</span>
            <span>Add Your Favorites</span>
          </button>
        </div>

        {/* Empty Content Area */}
        <div className="bg-live-secondary rounded p-3 flex items-center justify-center">
          <div className="text-live-muted text-[10px]">Empty content area</div>
        </div>

        {/* BetSlip Section */}
        <div className="space-y-1.5">
          <div className="bg-live-tertiary px-2 py-1 rounded border border-live-accent text-center">
            <span className="text-xs font-bold text-live-accent">BetSlip</span>
          </div>
          
          {/* Bet Info */}
          <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
            <div className="text-[10px] mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
            <div className="text-[10px] mb-1 font-bold text-live-primary">{selectedGame?.team1} ({extractW1Odds(selectedGame?.markets)})</div>
            <div className="text-[10px] mb-1 font-bold text-live-primary">{selectedGame?.team2} ({extractW2Odds(selectedGame?.markets)})</div>
            <div className="text-[10px] text-live-secondary mb-1">{selectedGame?.team1} - {selectedGame?.team2}</div>
            <div className="text-[10px] text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
          </div>
          
          {/* Stake Input */}
          <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
            <input 
              type="text"
              placeholder="Enter stake"
              value={stakeValue}
              onChange={handleStakeChange}
              className="w-full h-7 bg-live-hover border-0 rounded px-2 py-1 text-[10px] text-live-primary placeholder-live-secondary"
            />
          </div>
          
          {/* Possible Win */}
          <div className="flex justify-between items-center bg-live-tertiary px-2 py-1 rounded border border-live">
            <span className="text-[10px] text-live-primary">Possible win:</span>
            <span className="text-[10px] text-live-accent font-bold">0 €</span>
          </div>
          
          {/* Quick Stake Buttons */}
          <div className="flex gap-1.5" ref={containerRef}>
            {betAmounts.map((amount, index) => (
              <div key={index} className="flex-1">
                {editableIndex === index ? (
                  <input
                    ref={editInputRef}
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditSubmit(index)}
                    onKeyPress={(e) => handleEditKeyPress(e, index)}
                    className="w-full bg-live-hover border border-live rounded px-1.5 py-1 text-[10px] text-live-primary placeholder-live-secondary [-webkit-appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                ) : (
                  <button 
                    className="w-full bg-live-tertiary hover:bg-live-hover border border-live px-1.5 py-1 rounded text-[10px] font-medium text-live-primary transition-colors"
                    onClick={() => {
                      if (isEditingMode) {
                        setEditableIndex(index);
                        setEditValue(amount.toString());
                      } else {
                        // Set the stake value when clicking on a chip
                        handleChipClick(amount);
                      }
                    }}
                  >
                    {amount}
                  </button>
                )}
              </div>
            ))}
            <button 
              className={`border px-1.5 py-1 rounded text-[10px] font-medium transition-colors flex items-center justify-center ${
                isEditingMode 
                  ? 'bg-live-accent border-live-accent text-live-dark' 
                  : 'bg-live-tertiary hover:bg-live-hover border-live text-live-primary'
              }`}
              onClick={toggleEditMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-2.5 w-2.5 mx-auto ${isEditingMode ? 'text-live-dark' : 'text-live-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          
          {/* BET Button */}
          <button className="w-full bg-live-accent hover:bg-live-warning border border-live-accent text-live-dark px-2 py-1.5 rounded text-xs font-bold transition-colors">
            BET
          </button>
        </div>

        {/* Placeholder for Additional Stats - Moved after BET button */}
        <div className="bg-live-secondary rounded p-3 flex items-center justify-center">
          <div className="text-live-muted text-[10px]">Empty content area</div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-4 m-2 bg-live-primary rounded-lg shadow-lg shadow-black/50 flex flex-col gap-4 text-live-primary">
      {/* Header Section */}
      <div className="flex items-center gap-2 border-b border-live-accent pb-3 mb-1">
        <h2 className="text-lg font-bold text-live-accent">MY TEAMS</h2>
        <div className="h-0.5 w-8 bg-live-accent rounded-full"></div>
      </div>

      {/* Badges Section */}
      <div className="grid grid-cols-2 gap-3 pb-4 border-b border-live-accent">
        <div className="flex flex-col items-center gap-2 p-3 bg-live-tertiary rounded-lg border border-live shadow-live">
          <div className="bg-live-hover p-2 rounded-full border border-live-accent">
            <svg className="w-5 h-5 text-live-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-live-accent">Gold Tier</span>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 bg-live-tertiary rounded-lg border border-live shadow-live">
          <div className="bg-live-hover p-2 rounded-full border border-live-info">
            <svg className="w-5 h-5 text-live-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-live-info">Verified</span>
        </div>
      </div>

      {/* Odds Settings Panel */}
    

      {/* BetSlip Separator */}
      <div className="flex flex-col gap-2 py-1">
        <div className="flex items-center gap-2 py-1">
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
          <span className="text-sm font-bold text-live-accent px-2 py-0.5 bg-live-tertiary rounded-full border border-live-accent">
            BetSlip
          </span>
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
        </div>

        {/* Login/Register CTA - Moved here and fixed layout */}
        <div className="text-center text-xs text-live-muted bg-live-tertiary p-2 rounded-lg border border-live">
          <p>If you want to place a bet, please<LinkTo onClick={onLogin} text="login" /> or<LinkTo onClick={onRegister} text="register" /></p>
        </div>
      </div>

   

      {/* BetSlip Section - Using actual game data instead of static data */}
      <div className="space-y-1.5">
        {/* Bet Info - Using actual game data */}
        <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
          <div className="text-xs mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
          <div className="text-xs mb-1 font-bold text-live-primary">{selectedGame?.team1} ({extractW1Odds(selectedGame?.markets)})</div>
          <div className="text-xs mb-1 font-bold text-live-primary">{selectedGame?.team2} ({extractW2Odds(selectedGame?.markets)})</div>
          
          <div className="text-xs text-live-secondary mb-1">{selectedGame?.team1} - {selectedGame?.team2}</div>
          <div className="text-xs text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
        </div>
        
        {/* Stake Input */}
        <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
          <input 
            type="text"
            placeholder="Enter stake"
            value={stakeValue}
            onChange={handleStakeChange}
            className="w-full h-7 bg-live-hover border-0 rounded px-2.5 py-1 text-xs text-live-primary placeholder-live-secondary"
          />
        </div>
        
        {/* Possible Win */}
        <div className="flex justify-between items-center bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
          <span className="text-xs text-live-primary">Possible win:</span>
          <span className="text-xs text-live-accent font-bold">0 €</span>
        </div>
        
        {/* Quick Stake Buttons */}
        <div className="flex gap-1.5" ref={containerRef}>
          {betAmounts.map((amount, index) => (
            <div key={index} className="flex-1">
              {editableIndex === index ? (
                <input
                  ref={editInputRef}
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleEditSubmit(index)}
                  onKeyPress={(e) => handleEditKeyPress(e, index)}
                  className="w-full bg-live-hover border border-live rounded px-1.5 py-1 text-xs text-live-primary placeholder-live-secondary [-webkit-appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <button 
                  className="w-full bg-live-tertiary hover:bg-live-hover border border-live px-1.5 py-1 rounded text-xs font-medium text-live-primary transition-colors"
                  onClick={() => {
                    if (isEditingMode) {
                      setEditableIndex(index);
                      setEditValue(amount.toString());
                    } else {
                      // Set the stake value when clicking on a chip
                      handleChipClick(amount);
                    }
                  }}
                >
                  {amount}
                </button>
              )}
            </div>
          ))}
          <button 
            className={`border px-1.5 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center ${
              isEditingMode 
                ? 'bg-live-accent border-live-accent text-live-dark' 
                : 'bg-live-tertiary hover:bg-live-hover border-live text-live-primary'
            }`}
            onClick={toggleEditMode}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 mx-auto ${isEditingMode ? 'text-live-dark' : 'text-live-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        
        {/* BET Button */}
        <button className="w-full bg-live-accent hover:bg-live-warning border border-live-accent text-live-dark px-2.5 py-1.5 rounded text-sm font-bold transition-colors">
          BET
        </button>
      </div>

      {/* Placeholder for Additional Stats - Moved after BET button */}
      <div className="bg-live-tertiary p-4 rounded-lg border border-live-accent shadow-live flex items-center justify-center text-center h-24">
        <div className="space-y-1">
          <div className="w-10 h-10 bg-live-hover rounded-full flex items-center justify-center mx-auto border border-live-accent">
            <span className="text-live-accent text-lg">📊</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-live-primary">Advanced Match Analytics</span>
            <span className="block text-[10px] text-live-muted">Team Stats + Predictions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable link component
const LinkTo = ({ onClick, text }) => (
  <span 
    onClick={onClick} 
    className="mx-1 text-live-info cursor-pointer hover:text-live-accent hover:underline transition-colors font-medium"
  >
    {text}
  </span>
);