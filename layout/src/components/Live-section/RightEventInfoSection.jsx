"use client";

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserBalanceExposure } from '../../redux/Action/auth/updateUserBalanceExposureAction';
import { notifyError } from '../../utils/notificationService';
import API from '../../utils/api';

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

// Function to calculate active exposure (excluding cleared exposures)
const calculateActiveExposure = (exposures) => {
  if (!exposures || !Array.isArray(exposures)) {
    return 0;
  }
  
  return exposures.reduce((total, exposureObj) => {
    // Only calculate exposure when is_clear is false
    if (exposureObj?.is_clear === "true" || exposureObj?.is_clear === true) {
      return total;
    }
    const exposureValue = parseFloat(exposureObj?.exposure) || 0;
    return total + exposureValue;
  }, 0);
};

// Function to extract W1 odds from markets data or use passed odds
const extractW1Odds = (markets, passedOdds = null) => {
  // If we have passed odds, use those
  if (passedOdds && passedOdds.w1) {
    const parsedOdds = parseFloat(passedOdds.w1);
    if (!isNaN(parsedOdds) && passedOdds.w1 !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }
  
  // Otherwise extract from markets
  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];
  
  // Check if market is suspended
  if (mo?.status === "SUSPENDED") {
    return "-";
  }
  
  const r0 = mo?.runners?.[0];
  const w1 = r0?.backPrices?.[0]?.price;
  
  // Check if w1 is a valid number
  if (typeof w1 === "number" && !isNaN(w1)) {
    return w1.toFixed(2);
  }
  return '-';
};

// Function to extract X (draw) odds from markets data or use passed odds
const extractXOdds = (markets, passedOdds = null) => {
  // If we have passed odds, use those
  if (passedOdds && passedOdds.x) {
    const parsedOdds = parseFloat(passedOdds.x);
    if (!isNaN(parsedOdds) && passedOdds.x !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }
  
  // Otherwise extract from markets by looking for a runner with name "draw"
  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];
  
  // Check if market is suspended
  if (mo?.status === "SUSPENDED") {
    return "-";
  }
  
  const runners = mo?.runners || [];
  
  // Look for draw runner by name "draw" (case insensitive)
  const drawRunner = runners.find(runner => 
    runner.runnerName && runner.runnerName.toLowerCase() === "draw"
  );
  
  const x = drawRunner?.backPrices?.[0]?.price;
  
  // Check if x is a valid number
  if (typeof x === "number" && !isNaN(x)) {
    return x.toFixed(2);
  }
  return '-';
};

// Function to extract W2 odds from markets data or use passed odds
const extractW2Odds = (markets, passedOdds = null) => {
  // If we have passed odds, use those
  if (passedOdds && passedOdds.w2) {
    const parsedOdds = parseFloat(passedOdds.w2);
    if (!isNaN(parsedOdds) && passedOdds.w2 !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }
  
  // Otherwise extract from markets
  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];
  
  // Check if market is suspended
  if (mo?.status === "SUSPENDED") {
    return "-";
  }
  
  const r1 = mo?.runners?.[1];
  const w2 = r1?.backPrices?.[0]?.price;
  
  // Check if w2 is a valid number
  if (typeof w2 === "number" && !isNaN(w2)) {
    return w2.toFixed(2);
  }
  return '-';
};

export default function RightEventInfoSection({ selectedGame, onLogin, onRegister, isCompact = false }) {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector(state => state.Login);
  const { loading: exposureLoading, error: exposureError } = useSelector(state => state.UpdateUserBalanceExposure);
  const [oddsOption, setOddsOption] = useState('always ask');
  const [isOpen, setIsOpen] = useState(false);
  const [betAmounts, setBetAmounts] = useState([500, 1000, 5000]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [stakeValue, setStakeValue] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedOdd, setSelectedOdd] = useState(null);
  const [previousOdds, setPreviousOdds] = useState({ w1: null, x: null, w2: null }); // Track previous odds for highlighting
  const [highlightedOdds, setHighlightedOdds] = useState({ w1: false, x: false, w2: false }); // Track which odds to highlight
  const editInputRef = useRef(null);
  const containerRef = useRef(null);

  // Log userData changes for debugging
  useEffect(() => {
  
    if (userData) {
      const activeExposure = calculateActiveExposure(userData.exposures);

    }
  }, [userData]);

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

  // Handle team selection
  const handleTeamSelect = (teamName, oddValue) => {
    // Extract the latest odds for the selected team
    let latestOddValue = oddValue;
    
    if (teamName === selectedGame?.team1) {
      latestOddValue = extractW1Odds(selectedGame?.markets, selectedGame?.odds);
    } else if (teamName === 'Draw') {
      latestOddValue = extractXOdds(selectedGame?.markets, selectedGame?.odds);
    } else if (teamName === selectedGame?.team2) {
      latestOddValue = extractW2Odds(selectedGame?.markets, selectedGame?.odds);
    }
    
    setSelectedTeam(teamName);
    setSelectedOdd(latestOddValue);
    setStakeValue('');
  };

  // Handle placing a bet
  const handlePlaceBet = async () => {
  
    if (!isAuthenticated || !selectedTeam || !stakeValue) {
     
      return;
    }
    
    const stake = parseFloat(stakeValue);
    if (isNaN(stake) || stake <= 0) {

      return;
    }
    
    // Fetch fresh user data before placing the bet to ensure accurate balance check
    try {
      const response = await API.get("/users/profile");
   
      
      if (response?.data?.success === true || 
          response?.data?.meta?.code === 200 || 
          response?.data?.code === 200) {
        
        const freshUserData = response.data?.data || response.data;
    
        
        // Get current balance and calculate active exposure from fresh user data
        const currentBalance = parseFloat(freshUserData?.balance) || 0;
        const activeExposure = calculateActiveExposure(freshUserData?.exposures) || parseFloat(freshUserData?.exposure) || 0;
        
        // Calculate available balance using the same logic as MainNavbar
        const availableBalance = currentBalance - activeExposure;
        
        // Check if user has sufficient available balance
        if (stake > availableBalance) {
          // Show error message using the notification service
          notifyError("Insufficient balance to place this bet");
          return;
        }
        
        // Calculate new values using the same logic as MainNavbar
        // For exposure, we add the stake amount for this individual bet
        const newExposure = activeExposure + stake;
        // For balance, we deduct the stake from the current balance
        const newBalance = currentBalance - stake;
    

     
        dispatch(updateUserBalanceExposure({
          balance: newBalance,
          exposure: newExposure,
          eventId: selectedGame?.eventId || null,
          marketId: selectedGame?.markets?.matchOdds?.[0]?.marketId || null,
          is_clear: false,
          marketType: "matchOdds",
          stake: stake
        }));
      
      } else {
        // Fallback to using existing userData if fresh data fetch fails
      
        
        // Get current balance and calculate active exposure from existing userData
        const currentBalance = parseFloat(userData?.balance) || 0;
        const activeExposure = calculateActiveExposure(userData?.exposures) || parseFloat(userData?.exposure) || 0;
        
        // Calculate available balance using the same logic as MainNavbar
        const availableBalance = currentBalance - activeExposure;
        
        // Check if user has sufficient available balance
        if (stake > availableBalance) {
          // Show error message using the notification service
          notifyError("Insufficient balance to place this bet");
          return;
        }
        
        // Calculate new values using the same logic as MainNavbar
        // For exposure, we add the stake amount for this individual bet
        const newExposure = activeExposure + stake;
        // For balance, we deduct the stake from the current balance
        const newBalance = currentBalance - stake;
        
     

 
        dispatch(updateUserBalanceExposure({
          balance: newBalance,
          exposure: newExposure,
          eventId: selectedGame?.eventId || null,
          marketId: selectedGame?.markets?.matchOdds?.[0]?.marketId || null,
          is_clear: false,
          marketType: "matchOdds",
          stake: stake
        }));
    
      }
    } catch (error) {

      
      // Get current balance and calculate active exposure from existing userData
      const currentBalance = parseFloat(userData?.balance) || 0;
      const activeExposure = calculateActiveExposure(userData?.exposures) || parseFloat(userData?.exposure) || 0;
      
      // Calculate available balance using the same logic as MainNavbar
      const availableBalance = currentBalance - activeExposure;
      
      // Check if user has sufficient available balance
      if (stake > availableBalance) {
        // Show error message using the notification service
        notifyError("Insufficient balance to place this bet");
        return;
      }
      
      // Calculate new values using the same logic as MainNavbar
      // For exposure, we add the stake amount for this individual bet
      const newExposure = activeExposure + stake;
      // For balance, we deduct the stake from the current balance
      const newBalance = currentBalance - stake;
      
  

  

      dispatch(updateUserBalanceExposure({
        balance: newBalance,
        exposure: newExposure,
        eventId: selectedGame?.eventId || null,
        marketId: selectedGame?.markets?.matchOdds?.[0]?.marketId || null,
        is_clear: false,
        marketType: "matchOdds",
        stake: stake
      }));
 
    }
  };

  // Handle post-bet placement logic
  useEffect(() => {

    // Check if the exposure update was successful
    if (!exposureLoading && !exposureError) {
     
      // Update the local state immediately for UI feedback
      setSelectedTeam(null);
      setSelectedOdd(null);
      setStakeValue('');
    } else if (exposureError) {
  
      // You might want to show an error message to the user here
    }
  }, [exposureLoading, exposureError]);

  // Calculate possible win amount
  const calculatePossibleWin = () => {
    if (!stakeValue || !selectedOdd || isNaN(stakeValue) || selectedOdd === "-" || isNaN(parseFloat(selectedOdd))) return '0.00';
    const stake = parseFloat(stakeValue);
    const odd = parseFloat(selectedOdd);
    if (isNaN(stake) || isNaN(odd)) return '0.00';
    const possibleWin = (odd - 1) * stake;
    return possibleWin.toFixed(2);
  };

  // Update previous odds when game data changes and trigger highlighting
  useEffect(() => {
    if (selectedGame) {
      // Use passed odds if available, otherwise extract from markets
      const w1Odds = extractW1Odds(selectedGame.markets, selectedGame.odds);
      const xOdds = extractXOdds(selectedGame.markets, selectedGame.odds);
      const w2Odds = extractW2Odds(selectedGame.markets, selectedGame.odds);
      
      // Check if odds have changed
      const w1Changed = previousOdds.w1 !== null && w1Odds !== '-' && w1Odds !== previousOdds.w1;
      const xChanged = previousOdds.x !== null && xOdds !== '-' && xOdds !== previousOdds.x;
      const w2Changed = previousOdds.w2 !== null && w2Odds !== '-' && w2Odds !== previousOdds.w2;
      
      if (w1Changed || xChanged || w2Changed) {
        setHighlightedOdds({
          w1: w1Changed,
          x: xChanged,
          w2: w2Changed
        });
        
        // Update selectedOdd if the selected team's odds have changed
        if (selectedTeam === selectedGame?.team1 && w1Changed) {
          setSelectedOdd(w1Odds);
        } else if (selectedTeam === 'Draw' && xChanged) {
          setSelectedOdd(xOdds);
        } else if (selectedTeam === selectedGame?.team2 && w2Changed) {
          setSelectedOdd(w2Odds);
        }
        
        // Clear highlighting after animation duration
        setTimeout(() => {
          setHighlightedOdds({ w1: false, x: false, w2: false });
        }, 1000);
      }
      
      // Update previous odds
      setPreviousOdds({
        w1: w1Odds,
        x: xOdds,
        w2: w2Odds
      });
    }
  }, [selectedGame]); // Depend on the entire selectedGame object to catch odds updates

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
          
          {/* Login/Register CTA - Only visible when not authenticated */}
          {!isAuthenticated && (
            <div className="text-center text-[10px] text-live-muted bg-live-tertiary p-2 rounded-lg border border-live">
              <p>If you want to place a bet, please <LinkTo onClick={onLogin} text="login" /> or <LinkTo onClick={onRegister} text="register" /></p>
            </div>
          )}
          
          {/* Bet Info */}
          <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
            <div className="text-[10px] mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
            
            {/* Team selection boxes for compact view */}
            <div className="flex flex-col gap-1 my-1">
              {/* Team 1 with odds */}
              <div 
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${
                  selectedTeam === selectedGame?.team1 
                    ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                    : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
                }`}
                onClick={() => {
                  const w1Odds = extractW1Odds(selectedGame?.markets, selectedGame?.odds);
                  if (w1Odds !== '-') {
                    handleTeamSelect(selectedGame?.team1, w1Odds);
                  }
                }}
              >
                <span className={`font-medium text-[9px] truncate ${selectedTeam === selectedGame?.team1 ? 'text-white' : 'text-live-primary'}`}>
                  {selectedGame?.team1}
                </span>
                <div 
                  className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${
                    selectedTeam === selectedGame?.team1 
                      ? 'bg-live-dark text-live-accent border border-live-accent' 
                      : 'bg-live-odds text-live-accent border border-live'
                  } ${
                    highlightedOdds.w1 ? 'odds-highlight' : ''
                  }`}
                >
                  {extractW1Odds(selectedGame?.markets, selectedGame?.odds)}
                </div>
              </div>
              
              {/* Draw (X) odds */}
              <div 
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${
                  selectedTeam === 'Draw' 
                    ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                    : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
                }`}
                onClick={() => {
                  const xOdds = extractXOdds(selectedGame?.markets, selectedGame?.odds);
                  if (xOdds !== '-') {
                    handleTeamSelect('Draw', xOdds);
                  }
                }}
              >
                <span className={`font-medium text-[9px] truncate ${selectedTeam === 'Draw' ? 'text-white' : 'text-live-primary'}`}>
                  Draw
                </span>
                <div 
                  className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${
                    selectedTeam === 'Draw' 
                      ? 'bg-live-dark text-live-accent border border-live-accent' 
                      : 'bg-live-odds text-live-accent border border-live'
                  } ${
                    highlightedOdds.x ? 'odds-highlight' : ''
                  }`}
                >
                  {extractXOdds(selectedGame?.markets, selectedGame?.odds)}
                </div>
              </div>
              
              {/* Team 2 with odds */}
              <div 
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${
                  selectedTeam === selectedGame?.team2 
                    ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                    : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
                }`}
                onClick={() => {
                  const w2Odds = extractW2Odds(selectedGame?.markets, selectedGame?.odds);
                  if (w2Odds !== '-') {
                    handleTeamSelect(selectedGame?.team2, w2Odds);
                  }
                }}
              >
                <span className={`font-medium text-[9px] truncate ${selectedTeam === selectedGame?.team2 ? 'text-white' : 'text-live-primary'}`}>
                  {selectedGame?.team2}
                </span>
                <div 
                  className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${
                    selectedTeam === selectedGame?.team2 
                      ? 'bg-live-dark text-live-accent border border-live-accent' 
                      : 'bg-live-odds text-live-accent border border-live'
                  } ${
                    highlightedOdds.w2 ? 'odds-highlight' : ''
                  }`}
                >
                  {extractW2Odds(selectedGame?.markets, selectedGame?.odds)}
                </div>
              </div>
            </div>
            
            <div className="text-[10px] text-live-secondary mb-1">{selectedGame?.team1} - {selectedGame?.team2}</div>
            <div className="text-[10px] text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
          </div>
          
          {/* Stake Input and Possible Win - Only show when a team is selected */}
          {selectedTeam && (
            <>
              {/* Stake Input */}
              <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
                <input 
                  type="number"
                  placeholder="Enter stake"
                  value={stakeValue}
                  onChange={handleStakeChange}
                  className="w-full h-7 bg-live-hover border-0 rounded px-2 py-1 text-[10px] text-live-primary placeholder-live-secondary"
                />
              </div>
              
              {/* Possible Win */}
              <div className="flex justify-between items-center bg-live-tertiary px-2 py-1 rounded border border-live">
                <span className="text-[10px] text-live-primary">Possible win:</span>
                <span className="text-[10px] text-live-accent font-bold">{calculatePossibleWin()} €</span>
              </div>
            </>
          )}
          
          {/* Quick Stake Buttons - Only show when a team is selected */}
          {selectedTeam && (
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
          )}
          
          {/* BET Button - Only enabled when a team is selected and authenticated */}
          <button 
            className={`w-full px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              isAuthenticated && selectedTeam 
                ? 'bg-live-accent hover:bg-live-warning border border-live-accent text-live-accent hover:text-live-dark' 
                : 'bg-live-tertiary border border-live text-live-accent cursor-not-allowed opacity-50'
            }`}
            disabled={!isAuthenticated || !selectedTeam}
            onClick={handlePlaceBet}
          >
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

        {/* Login/Register CTA - Only visible when not authenticated */}
        {!isAuthenticated && (
          <div className="text-center text-xs text-live-muted bg-live-tertiary p-2 rounded-lg border border-live">
            <p>If you want to place a bet, please<LinkTo onClick={onLogin} text="login" /> or<LinkTo onClick={onRegister} text="register" /></p>
          </div>
        )}
      </div>

   

      {/* BetSlip Section - Using actual game data instead of static data */}
      <div className="space-y-1.5">
        {/* Bet Info - Using actual game data */}
        <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
          <div className="text-xs mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
          
          {/* Team selection boxes */}
          <div className="flex flex-col gap-2 my-2">
            {/* Team 1 with odds */}
            <div 
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                selectedTeam === selectedGame?.team1 
                  ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                  : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
              }`}
              onClick={() => {
                const w1Odds = extractW1Odds(selectedGame?.markets, selectedGame?.odds);
                if (w1Odds !== '-') {
                  handleTeamSelect(selectedGame?.team1, w1Odds);
                }
              }}
            >
              <span className={`font-medium text-xs truncate ${selectedTeam === selectedGame?.team1 ? 'text-white' : 'text-live-primary'}`}>
                {selectedGame?.team1}
              </span>
              <div 
                className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${
                  selectedTeam === selectedGame?.team1 
                    ? 'bg-live-dark text-live-accent border border-live-accent' 
                    : 'bg-live-odds text-live-accent border border-live'
                } ${
                  highlightedOdds.w1 ? 'odds-highlight' : ''
                }`}
              >
                {extractW1Odds(selectedGame?.markets, selectedGame?.odds)}
              </div>
            </div>
            
            {/* Draw (X) odds */}
            <div 
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                selectedTeam === 'Draw' 
                  ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                  : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
              }`}
              onClick={() => {
                const xOdds = extractXOdds(selectedGame?.markets, selectedGame?.odds);
                if (xOdds !== '-') {
                  handleTeamSelect('Draw', xOdds);
                }
              }}
            >
              <span className={`font-medium text-xs truncate ${selectedTeam === 'Draw' ? 'text-white' : 'text-live-primary'}`}>
                Draw
              </span>
              <div 
                className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${
                  selectedTeam === 'Draw' 
                    ? 'bg-live-dark text-live-accent border border-live-accent' 
                    : 'bg-live-odds text-live-accent border border-live'
                } ${
                  highlightedOdds.x ? 'odds-highlight' : ''
                }`}
              >
                {extractXOdds(selectedGame?.markets, selectedGame?.odds)}
              </div>
            </div>
            
            {/* Team 2 with odds */}
            <div 
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                selectedTeam === selectedGame?.team2 
                  ? 'bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]' 
                  : 'bg-live-hover border-live hover:shadow-[0_0_4px_var(--live-accent-primary)]'
              }`}
              onClick={() => {
                const w2Odds = extractW2Odds(selectedGame?.markets, selectedGame?.odds);
                if (w2Odds !== '-') {
                  handleTeamSelect(selectedGame?.team2, w2Odds);
                }
              }}
            >
              <span className={`font-medium text-xs truncate ${selectedTeam === selectedGame?.team2 ? 'text-white' : 'text-live-primary'}`}>
                {selectedGame?.team2}
              </span>
              <div 
                className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${
                  selectedTeam === selectedGame?.team2 
                    ? 'bg-live-dark text-live-accent border border-live-accent' 
                    : 'bg-live-odds text-live-accent border border-live'
                } ${
                  highlightedOdds.w2 ? 'odds-highlight' : ''
                }`}
              >
                {extractW2Odds(selectedGame?.markets, selectedGame?.odds)}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-live-secondary mb-1">{selectedGame?.team1} - {selectedGame?.team2}</div>
          <div className="text-xs text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
        </div>
        
        {/* Stake Input and Possible Win - Only show when a team is selected */}
        {selectedTeam && (
          <>
            {/* Stake Input */}
            <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
              <input 
                type="number"
                placeholder="Enter stake"
                value={stakeValue}
                onChange={handleStakeChange}
                className="w-full h-7 bg-live-hover border-0 rounded px-2.5 py-1 text-xs text-live-primary placeholder-live-secondary"
              />
            </div>
            
            {/* Possible Win */}
            <div className="flex justify-between items-center bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
              <span className="text-xs text-live-primary">Possible win:</span>
              <span className="text-xs text-live-accent font-bold">{calculatePossibleWin()}</span>
            </div>
          </>
        )}
        
        {/* Quick Stake Buttons - Only show when a team is selected */}
        {selectedTeam && (
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
        )}
        
        {/* BET Button - Only enabled when a team is selected and authenticated */}
        <button 
          className={`w-full px-2.5 py-1.5 rounded text-sm font-bold transition-colors cursor-pointer color-yellowborder-solid transition-all duration-200 ${
            isAuthenticated && selectedTeam 
              ? 'bg-live-accent hover:bg-live-warning border border-live-accent text-live-accent hover:text-live-dark hover:scale-[1.02] hover:shadow-[0_0_8px_var(--live-accent-primary)]' 
              : 'bg-live-tertiary border border-live text-live-accent cursor-not-allowed opacity-50'
          }`}
          disabled={!isAuthenticated || !selectedTeam}
          onClick={handlePlaceBet}
        >
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