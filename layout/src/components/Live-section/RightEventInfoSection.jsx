// This component handles the bet placement logic and sends the following payload to the backend:
// - balance: updated user balance after deducting stake
// - eventId: ID of the selected event
// - marketId: ID of the market
// - is_clear: flag indicating if the bet is settled
// - marketType: type of market (e.g., "matchOdds")
// - stake: amount being bet
// - sportsid: ID of the sport
// - runnerid: ID of the selected runner
// - runnername: name of the selected team/runner
// - odds: odds value for the selected bet

"use client";

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserBalanceExposure } from '../../redux/Action/auth/updateUserBalanceExposureAction';
import { notifyError } from '../../utils/notificationService';
import API from '../../utils/api';

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';

  const date = new Date(parseInt(timestamp));

  if (isNaN(date.getTime())) return 'Invalid Date';

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

const calculateActiveExposure = (exposures) => {
  if (!exposures || !Array.isArray(exposures)) {
    return 0;
  }

  return exposures.reduce((total, exposureObj) => {
    if (exposureObj?.is_clear === "true" || exposureObj?.is_clear === true) {
      return total;
    }
    const exposureValue = parseFloat(exposureObj?.exposure) || 0;
    return total + exposureValue;
  }, 0);
};

const extractW1Odds = (markets, passedOdds = null) => {
  if (passedOdds && passedOdds.w1) {
    const parsedOdds = parseFloat(passedOdds.w1);
    if (!isNaN(parsedOdds) && passedOdds.w1 !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }

  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];

  if (mo?.status === "SUSPENDED") {
    return "-";
  }

  const r0 = mo?.runners?.[0];
  const w1 = r0?.backPrices?.[0]?.price;

  if (typeof w1 === "number" && !isNaN(w1)) {
    return w1.toFixed(2);
  }
  return '-';
};

const extractXOdds = (markets, passedOdds = null) => {
  if (passedOdds && passedOdds.x) {
    const parsedOdds = parseFloat(passedOdds.x);
    if (!isNaN(parsedOdds) && passedOdds.x !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }

  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];

  if (mo?.status === "SUSPENDED") {
    return "-";
  }

  const runners = mo?.runners || [];

  const drawRunner = runners.find(runner =>
    runner.runnerName && runner.runnerName.toLowerCase() === "draw"
  );

  const x = drawRunner?.backPrices?.[0]?.price;

  if (typeof x === "number" && !isNaN(x)) {
    return x.toFixed(2);
  }
  return '-';
};

const extractW2Odds = (markets, passedOdds = null) => {
  if (passedOdds && passedOdds.w2) {
    const parsedOdds = parseFloat(passedOdds.w2);
    if (!isNaN(parsedOdds) && passedOdds.w2 !== "-") {
      return parsedOdds.toFixed(2);
    }
    return "-";
  }

  if (!markets) return '-';
  const mo = markets?.matchOdds?.[0];

  if (mo?.status === "SUSPENDED") {
    return "-";
  }

  const r1 = mo?.runners?.[1];
  const w2 = r1?.backPrices?.[0]?.price;

  if (typeof w2 === "number" && !isNaN(w2)) {
    return w2.toFixed(2);
  }
  return '-';
};

const getRunnerIdForSelectedTeam = (selectedGame, selectedTeam) => {
  if (!selectedGame?.markets?.matchOdds?.[0]?.runners) return null;

  const runners = selectedGame.markets.matchOdds[0].runners;

  if (selectedTeam === 'Draw') {
    const drawRunner = runners.find(runner =>
      runner.runnerName && runner.runnerName.toLowerCase() === "draw"
    );
    return drawRunner ? drawRunner.runnerId : null;
  } else if (selectedTeam === selectedGame.team1) {
    const nonDrawRunners = runners.filter(runner =>
      !runner.runnerName || runner.runnerName.toLowerCase() !== "draw"
    );
    return nonDrawRunners[0] ? nonDrawRunners[0].runnerId : null;
  } else if (selectedTeam === selectedGame.team2) {
    const nonDrawRunners = runners.filter(runner =>
      !runner.runnerName || runner.runnerName.toLowerCase() !== "draw"
    );
    return nonDrawRunners.length > 1 ? nonDrawRunners[nonDrawRunners.length - 1].runnerId :
      (nonDrawRunners[0] ? nonDrawRunners[0].runnerId : null);
  }

  return null;
};

// Add this helper function after the existing helper functions
const isMatchSuspended = (selectedGame) => {
  // Check if match status is suspended
  if (selectedGame?.status === "SUSPENDED") return true;
  
  // Check if all odds are suspended (existing logic from GameCard)
  const odds = selectedGame?.odds || {};
  if (odds.w1 === "SUSPENDED" && odds.x === "SUSPENDED" && odds.w2 === "SUSPENDED") return true;
  
  // Check if markets are suspended
  const markets = selectedGame?.markets?.matchOdds?.[0];
  if (markets?.status === "SUSPENDED") return true;
  
  return false;
};

export default function RightEventInfoSection({ selectedGame, onLogin, onRegister, isCompact = false, isSwitchingMatch }) {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector(state => state.Login);
  const { loading: exposureLoading, error: exposureError } = useSelector(state => state.UpdateUserBalanceExposure);
  const { userData: profileData, loading } = useSelector(state => state.GetUserData);
  const [socketExposure, setSocketExposure] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [selectedRunnerInfo, setSelectedRunnerInfo] = useState(null);

  // Check if this is a market runner selection
  const isMarketRunnerSelection = selectedGame?.selectedMarket && selectedGame?.selectedRunner;
  
  // Check if match is suspended
  const matchIsSuspended = isMatchSuspended(selectedGame);
  
  // Get the market name to display
  const getMarketName = () => {
    if (isMarketRunnerSelection) {
      return selectedGame.selectedMarket.marketName;
    }
    
    // For left section game card selections, use the first market name if available
    if (selectedGame?.markets?.matchOdds?.[0]?.marketName) {
      return selectedGame.markets.matchOdds[0].marketName;
    }
    
    return "Match Odds"; // Default market name
  };

  const marketName = getMarketName();

  // Initialize WebSocket connection for real-time exposure updates
  useEffect(() => {
    if (isAuthenticated && userData?._id) {
      const newSocket = new WebSocket('ws://localhost:3001'); // Adjust URL as needed

      newSocket.onopen = () => {
        console.log('WebSocket connection established in RightEventInfoSection');
        setIsSocketConnected(true);
      };

      newSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (data.type === 'exposureUpdate' && data.userId === userData._id) {
          console.log(`User ${data.userId} exposure updated to ${data.exposure} in RightEventInfoSection`);
          setSocketExposure(parseFloat(data.exposure) || 0);
        }
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed in RightEventInfoSection');
        setIsSocketConnected(false);
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error in RightEventInfoSection:', error);
        setIsSocketConnected(false);
      };

      // Clean up function to close the socket when component unmounts or user logs out
      return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }
  }, [isAuthenticated, userData?._id]);

  const [isOpen, setIsOpen] = useState(false);
  const [betAmounts, setBetAmounts] = useState([500, 1000, 5000]);
  const [editableIndex, setEditableIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [stakeValue, setStakeValue] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedOdd, setSelectedOdd] = useState(null);
  const [previousOdds, setPreviousOdds] = useState({ w1: null, x: null, w2: null });
  const [highlightedOdds, setHighlightedOdds] = useState({ w1: false, x: false, w2: false });
  const editInputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (userData) {
      const activeExposure = calculateActiveExposure(userData.exposures);
    }
  }, [userData]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

  useEffect(() => {
    if (editableIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editableIndex]);

  const handleEditSubmit = (index) => {
    if (editValue && !isNaN(editValue) && Number(editValue) > 0) {
      const newBetAmounts = [...betAmounts];
      newBetAmounts[index] = Number(editValue);
      setBetAmounts(newBetAmounts);
    }
    setEditableIndex(null);
    setEditValue('');
    setIsEditingMode(false);
  };

  const handleEditKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit(index);
    } else if (e.key === 'Escape') {
      setEditableIndex(null);
      setEditValue('');
      setIsEditingMode(false);
    }
  };

  const handleChipClick = (amount) => {
    setStakeValue(amount.toString());
  };

  const handleStakeChange = (e) => {
    setStakeValue(e.target.value);
  };

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    if (isEditingMode) {
      setEditableIndex(null);
      setEditValue('');
    }
  };

  const handleTeamSelect = (teamName, oddValue) => {
    // Reset market runner selection when selecting a team
    if (selectedRunnerInfo) {
      setSelectedRunnerInfo(null);
    }
    
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

  const handlePlaceBet = async () => {
    if (!isAuthenticated || (!selectedTeam && !isMarketRunnerSelection)) {
      return;
    }

    const stake = parseFloat(stakeValue);

    if (isNaN(stake) || stake <= 0) {
      notifyError("Please enter a valid stake amount");
      return;
    }

    try {
      if (isMarketRunnerSelection) {
        // Handle market runner bet
        const market = selectedGame.selectedMarket;
        const runner = selectedGame.selectedRunner;
        
        dispatch(updateUserBalanceExposure({
          balance: parseFloat(userData?.balance) || 0,
          eventId: selectedGame?.eventId || null,
          marketId: market?.marketId || null,
          is_clear: false,
          marketType: market?.marketType || "matchOdds",
          stake: stake,
          sportsid: selectedGame?.sportId || null,
          runnerid: runner?.runnerId || null,
          runnername: runner?.runnerName || null,
          odds: selectedGame?.selectedOdd || null,
          competitionId: selectedGame?.competitionId || null,
          competitionName: selectedGame?.competitionName || null,
          marketName: market?.marketName || null,
          runners: market?.runners?.map(r => r.runnerName) || []
        }));
      } else {
        // Handle default match odds bet (existing logic)
        const market = selectedGame?.markets?.matchOdds?.[0];
        const marketType = market?.marketType || "matchOdds";
        const marketName = market?.marketName || "Match Odds";

        dispatch(updateUserBalanceExposure({
          balance: parseFloat(userData?.balance) || 0,
          eventId: selectedGame?.eventId || null,
          marketId: market?.marketId || null,
          is_clear: false,
          marketType: marketType,
          stake: stake,
          sportsid: selectedGame?.sportId || null,
          runnerid: getRunnerIdForSelectedTeam(selectedGame, selectedTeam),
          runnername: selectedTeam,
          odds: selectedOdd,
          competitionId: selectedGame?.competitionId || null,
          competitionName: selectedGame?.competitionName || null,
          marketName: marketName,
          runners: market?.runners?.map(runner => runner.runnerName) || []
        }));
      }
    } catch (err) {
      notifyError(err.message || "Failed to place bet");
    }
  };


  useEffect(() => {
    if (!exposureLoading && !exposureError) {
      setSelectedTeam(null);
      setSelectedOdd(null);
      setStakeValue('');
      // Don't reset market runner selection here
    } else if (exposureError) {
    }
  }, [exposureLoading, exposureError]);

  const calculatePossibleWin = () => {
    // Check if this is a market runner selection
    const isMarketRunnerSelection = selectedGame?.selectedMarket && selectedGame?.selectedRunner;
    const oddsValue = isMarketRunnerSelection ? selectedGame?.selectedOdd : selectedOdd;
    
    if (!stakeValue || !oddsValue || isNaN(stakeValue) || oddsValue === "-" || isNaN(parseFloat(oddsValue))) return '0.00';
    const stake = parseFloat(stakeValue);
    const odd = parseFloat(oddsValue);
    if (isNaN(stake) || isNaN(odd)) return '0.00';
    const possibleWin = (odd - 1) * stake;
    return possibleWin.toFixed(2);
  };

  useEffect(() => {
    if (selectedGame) {
      // For market runner selections, update the odds in real-time
      if (selectedGame.selectedMarket && selectedGame.selectedRunner) {
        // Find the current odds for the selected runner
        const market = selectedGame.selectedMarket;
        const runner = selectedGame.selectedRunner;
        
        if (market.runners) {
          const updatedRunner = market.runners.find(r => r && r.runnerId === runner.runnerId);
          if (updatedRunner && updatedRunner.backPrices && updatedRunner.backPrices.length > 0) {
            const newOdds = updatedRunner.backPrices[0].price;
            if (newOdds !== undefined && newOdds !== null) {
              const formattedOdds = typeof newOdds === "number" ? newOdds.toFixed(2) : newOdds.toString();
              
              // Only update if odds have changed
              if (formattedOdds !== selectedOdd) {
                setSelectedOdd(formattedOdds);
                
                // Highlight the odds change
                setHighlightedOdds(prev => ({ ...prev, selected: true }));
                setTimeout(() => {
                  setHighlightedOdds(prev => ({ ...prev, selected: false }));
                }, 1000);
              }
            }
          }
        }
      }
      
      // For regular match odds, keep existing logic
      const w1Odds = extractW1Odds(selectedGame.markets, selectedGame.odds);
      const xOdds = extractXOdds(selectedGame.markets, selectedGame.odds);
      const w2Odds = extractW2Odds(selectedGame.markets, selectedGame.odds);

      const w1Changed = previousOdds.w1 !== null && w1Odds !== '-' && w1Odds !== previousOdds.w1;
      const xChanged = previousOdds.x !== null && xOdds !== '-' && xOdds !== previousOdds.x;
      const w2Changed = previousOdds.w2 !== null && w2Odds !== '-' && w2Odds !== previousOdds.w2;

      if (w1Changed || xChanged || w2Changed) {
        setHighlightedOdds({
          w1: w1Changed,
          x: xChanged,
          w2: w2Changed
        });

        if (selectedTeam === selectedGame?.team1 && w1Changed) {
          setSelectedOdd(w1Odds);
        } else if (selectedTeam === 'Draw' && xChanged) {
          setSelectedOdd(xOdds);
        } else if (selectedTeam === selectedGame?.team2 && w2Changed) {
          setSelectedOdd(w2Odds);
        }

        setTimeout(() => {
          setHighlightedOdds({ w1: false, x: false, w2: false });
        }, 1000);
      }

      setPreviousOdds({
        w1: w1Odds,
        x: xOdds,
        w2: w2Odds
      });
    }
  }, [selectedGame]);

  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center h-full text-live-muted text-sm bg-gradient-to-b from-live-tertiary to-live-secondary rounded p-4 shadow-md">
        <div className="flex flex-col items-center animate-pulse-scale">
          <div className="relative w-10 h-10">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-6 h-6 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-3 text-live-primary text-xs font-medium">Loading game details...</p>
        </div>
      </div>
    );
  }

  // Show loading state when switching matches
  if (isSwitchingMatch) {
    return (
      <div className="flex items-center justify-center h-full text-live-muted text-sm bg-gradient-to-b from-live-tertiary to-live-secondary rounded p-4 shadow-md">
        <div className="flex flex-col items-center animate-pulse-scale">
          <div className="relative w-10 h-10">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-6 h-6 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-3 text-live-primary text-xs font-medium">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (isCompact) {
    // Check if this is a market runner selection
    // Remove duplicate declarations since they're already declared above

    return (
      <div className="p-2.5 m-1.5 bg-live-primary rounded-lg border border-live-accent shadow-live flex flex-col gap-2 text-live-primary">
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-live-primary">MY TEAMS</h3>
          <button className="w-full flex items-center gap-1.5 bg-live-primary hover:bg-live-hover px-2 py-1.5 rounded text-xs">
            <span className="text-live-accent">★</span>
            <span>Add Your Favorites</span>
          </button>
        </div>

        <div className="bg-live-secondary rounded p-3 flex items-center justify-center">
          <div className="text-live-muted text-[10px]">Empty content area</div>
        </div>

        <div className="space-y-1.5">
          <div className="bg-live-tertiary px-2 py-1 rounded border border-live-accent text-center">
            <span className="text-xs font-bold text-live-accent">BetSlip</span>
          </div>

          {!isAuthenticated && (
            <div className="text-center text-[10px] text-live-muted bg-live-tertiary p-2 rounded-lg border border-live">
              <p>If you want to place a bet, please <LinkTo onClick={onLogin} text="login" /> or <LinkTo onClick={onRegister} text="register" /></p>
            </div>
          )}

          <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
            <div className="text-[10px] mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
            
            {/* Display market name for both left section and middle section selections */}
            <div className="text-[9px] mb-1 font-medium text-live-accent opacity-80">
              {marketName}
            </div>

            {/* Display runners based on selection type */}
            {matchIsSuspended ? (
              // Show suspended message instead of runners for suspended matches
              <div className="flex flex-col gap-1 my-1 p-2 bg-live-odds rounded text-center">
                <span className="text-sm font-bold text-live-primary">Match Suspended</span>
                <span className="text-xs text-live-muted">Betting is not available</span>
              </div>
            ) : isMarketRunnerSelection ? (
              // Market runner selection view
              <div className="flex flex-col gap-1 my-1">
                <div
                  className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]`}
                >
                  <span className="font-medium text-[9px] truncate text-white">
                    {selectedGame.selectedRunner.runnerName}
                  </span>
                  <div className="min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] bg-live-dark text-live-accent border border-live-accent">
                    {selectedGame.selectedOdd}
                  </div>
                </div>
              </div>
            ) : (
              // Default match odds view
              <div className="flex flex-col gap-1 my-1">
                <div
                  className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${selectedTeam === selectedGame?.team1
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
                    className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${selectedTeam === selectedGame?.team1
                        ? 'bg-live-dark text-live-accent border border-live-accent'
                        : 'bg-live-odds text-live-accent border border-live'
                      } ${highlightedOdds.w1 ? 'odds-highlight' : ''
                      }`}
                  >
                    {extractW1Odds(selectedGame?.markets, selectedGame?.odds)}
                  </div>
                </div>

                {extractXOdds(selectedGame?.markets, selectedGame?.odds) !== '-' && (
                  <div
                    className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${selectedTeam === 'Draw'
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
                      className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${selectedTeam === 'Draw'
                          ? 'bg-live-dark text-live-accent border border-live-accent'
                          : 'bg-live-odds text-live-accent border border-live'
                        } ${highlightedOdds.x ? 'odds-highlight' : ''
                        }`}
                    >
                      {extractXOdds(selectedGame?.markets, selectedGame?.odds)}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-between p-1.5 rounded border cursor-pointer transition-all ${selectedTeam === selectedGame?.team2
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
                    className={`min-w-[36px] h-[24px] flex items-center justify-center rounded font-bold text-[10px] ${selectedTeam === selectedGame?.team2
                        ? 'bg-live-dark text-live-accent border border-live-accent'
                        : 'bg-live-odds text-live-accent border border-live'
                      } ${highlightedOdds.w2 ? 'odds-highlight' : ''
                      }`}
                  >
                    {extractW2Odds(selectedGame?.markets, selectedGame?.odds)}
                  </div>
                </div>
              </div>
            )}

            <div className="text-[10px] text-live-secondary mb-1">
              {isMarketRunnerSelection 
                ? `${selectedGame?.team1} - ${selectedGame?.team2}` 
                : `${selectedGame?.team1} - ${selectedGame?.team2}`}
            </div>
            <div className="text-[10px] text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
          </div>

          {/* Only show betting controls if match is not suspended */}
          {!matchIsSuspended && (selectedTeam || isMarketRunnerSelection) && (
            <>
              <div className="bg-live-tertiary px-2 py-1 rounded border border-live">
                <input
                  type="number"
                  placeholder="Enter stake"
                  value={stakeValue}
                  onChange={handleStakeChange}
                  className="w-full h-7 bg-live-hover border-0 rounded px-2 py-1 text-[10px] text-live-primary placeholder-live-secondary"
                />
              </div>

              <div className="flex justify-between items-center bg-live-tertiary px-2 py-1 rounded border border-live">
                <span className="text-[10px] text-live-primary">Possible win:</span>
                <span className="text-[10px] text-live-accent font-bold">{calculatePossibleWin()} €</span>
              </div>
            </>
          )}

          {/* Only show betting chips if match is not suspended */}
          {!matchIsSuspended && (selectedTeam || isMarketRunnerSelection) && (
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
                className={`border px-1.5 py-1 rounded text-[10px] font-medium transition-colors flex items-center justify-center ${isEditingMode
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

        </div>

        <div className="bg-live-secondary rounded p-3 flex items-center justify-center">
          <div className="text-live-muted text-[10px]">Empty content area</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 m-2 bg-live-primary rounded-lg shadow-lg shadow-black/50 flex flex-col gap-4 text-live-primary">
      <div className="flex items-center gap-2 border-b border-live-accent pb-3 mb-1">
        <h2 className="text-lg font-bold text-live-accent">MY TEAMS</h2>
        <div className="h-0.5 w-8 bg-live-accent rounded-full"></div>
      </div>

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

      <div className="flex flex-col gap-2 py-1">
        <div className="flex items-center gap-2 py-1">
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
          <span className="text-sm font-bold text-live-accent px-2 py-0.5 bg-live-tertiary rounded-full border border-live-accent">
            BetSlip
          </span>
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
        </div>

        {!isAuthenticated && (
          <div className="text-center text-xs text-live-muted bg-live-tertiary p-2 rounded-lg border border-live">
            <p>If you want to place a bet, please<LinkTo onClick={onLogin} text="login" /> or<LinkTo onClick={onRegister} text="register" /></p>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
          <div className="text-xs mb-1 font-bold text-live-primary">{selectedGame?.competitionName}</div>
          
          {/* Display market name for both left section and middle section selections */}
          <div className="text-[9px] mb-1 font-medium text-live-accent opacity-80">
            {marketName}
          </div>

          {/* Display runners based on selection type */}
          {matchIsSuspended ? (
            // Show suspended message instead of runners for suspended matches
            <div className="flex flex-col gap-2 my-2 p-4 bg-live-odds rounded text-center">
              <span className="text-lg font-bold text-live-primary">Match Suspended</span>
              <span className="text-sm text-live-muted">Betting is not available for this match</span>
            </div>
          ) : isMarketRunnerSelection ? (
            // Market runner selection view
            <div className="flex flex-col gap-2 my-2">
              <div
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all bg-live-accent border-live-accent shadow-[0_0_8px_var(--live-accent-primary)] scale-[1.02]`}
              >
                <span className="font-medium text-xs truncate text-white">
                  {selectedGame.selectedRunner.runnerName}
                </span>
                <div className="min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs bg-live-dark text-live-accent border border-live-accent">
                  {selectedGame.selectedOdd}
                </div>
              </div>
            </div>
          ) : (
            // Default match odds view
            <div className="flex flex-col gap-2 my-2">
              <div
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${selectedTeam === selectedGame?.team1
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
                  className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${selectedTeam === selectedGame?.team1
                      ? 'bg-live-dark text-live-accent border border-live-accent'
                      : 'bg-live-odds text-live-accent border border-live'
                    } ${highlightedOdds.w1 ? 'odds-highlight' : ''
                    }`}
                >
                  {extractW1Odds(selectedGame?.markets, selectedGame?.odds)}
                </div>
              </div>

              {extractXOdds(selectedGame?.markets, selectedGame?.odds) !== '-' && (
                <div
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${selectedTeam === 'Draw'
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
                    className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${selectedTeam === 'Draw'
                        ? 'bg-live-dark text-live-accent border border-live-accent'
                        : 'bg-live-odds text-live-accent border border-live'
                      } ${highlightedOdds.x ? 'odds-highlight' : ''
                      }`}
                  >
                    {extractXOdds(selectedGame?.markets, selectedGame?.odds)}
                  </div>
                </div>
              )}

              <div
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${selectedTeam === selectedGame?.team2
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
                  className={`min-w-[44px] h-[28px] flex items-center justify-center rounded font-bold text-xs ${selectedTeam === selectedGame?.team2
                      ? 'bg-live-dark text-live-accent border border-live-accent'
                      : 'bg-live-odds text-live-accent border border-live'
                    } ${highlightedOdds.w2 ? 'odds-highlight' : ''
                    }`}
                >
                  {extractW2Odds(selectedGame?.markets, selectedGame?.odds)}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-live-secondary mb-1">
            {isMarketRunnerSelection 
              ? `${selectedGame?.team1} - ${selectedGame?.team2}` 
              : `${selectedGame?.team1} - ${selectedGame?.team2}`}
          </div>
          <div className="text-xs text-live-secondary">{formatDateTime(selectedGame?.openDate)}</div>
        </div>

        {/* Only show betting controls if match is not suspended */}
        {!matchIsSuspended && (selectedTeam || isMarketRunnerSelection) && (
          <>
            <div className="bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
              <input
                type="number"
                placeholder="Enter stake"
                value={stakeValue}
                onChange={handleStakeChange}
                className="w-full h-7 bg-live-hover border-0 rounded px-2.5 py-1 text-xs text-live-primary placeholder-live-secondary"
              />
            </div>

            <div className="flex justify-between items-center bg-live-tertiary px-2.5 py-1.5 rounded border border-live">
              <span className="text-xs text-live-primary">Possible win:</span>
              <span className="text-xs text-live-accent font-bold">{calculatePossibleWin()}</span>
            </div>
          </>
        )}

        {/* Only show betting chips if match is not suspended */}
        {!matchIsSuspended && (selectedTeam || isMarketRunnerSelection) && (
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
              className={`border px-1.5 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center ${isEditingMode
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

        {/* Only show BET button if match is not suspended */}
        <button
          className={`w-full px-2.5 py-1.5 rounded text-sm font-bold transition-colors cursor-pointer color-yellowborder-solid transition-all duration-200 ${
            !matchIsSuspended && isAuthenticated && (selectedTeam || isMarketRunnerSelection)
              ? 'bg-live-accent hover:bg-live-warning border border-live-accent text-live-accent hover:text-live-dark hover:scale-[1.02] hover:shadow-[0_0_8px_var(--live-accent-primary)]'
              : 'bg-live-tertiary border border-live text-live-accent cursor-not-allowed opacity-50'
          }`}
          disabled={matchIsSuspended || !isAuthenticated || (!selectedTeam && !isMarketRunnerSelection)}
          onClick={handlePlaceBet}
        >
          {matchIsSuspended ? 'MATCH SUSPENDED' : 'BET'}
        </button>
      </div>

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

const LinkTo = ({ onClick, text }) => (
  <span
    onClick={onClick}
    className="mx-1 text-live-info cursor-pointer hover:text-live-accent hover:underline transition-colors font-medium"
  >
    {text}
  </span>
);