import React, { useEffect, useState, useRef } from 'react';
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import RightEventInfoSection from './RightEventInfoSection';
import LoginModal from '../../modals/LoginModal';
import RegisterModal from '../../modals/RegisterModal';
import { fetchSportsEvents } from "../../utils/sportsEventsApi";

function extractOddsW1W2(markets) {
  const mo = markets?.matchOdds?.[0];
  const r0 = mo?.runners?.[0];
  const r1 = mo?.runners?.[1];
  const w1 = r0?.backPrices?.[0]?.price;
  const w2 = r1?.backPrices?.[0]?.price;
  return {
    w1: typeof w1 === "number" ? w1.toString() : "-",
    w2: typeof w2 === "number" ? w2.toString() : "-",
  };
}

function formatDateTime(value) {
  try {
    if (!value) return "--/--/---- --:--";
    // If already a Date
    if (value instanceof Date && !isNaN(value)) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear();
      const time = value.toTimeString().slice(0, 5);
      return `${day}/${month}.${year} ${time}`;
    }
    // If number (epoch ms or seconds)
    if (typeof value === "number") {
      const ms = value > 1e12 ? value : value * 1000;
      const d = new Date(ms);
      if (!isNaN(d)) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const time = d.toTimeString().slice(0, 5);
        return `${day}/${month}.${year} ${time}`;
      }
    }
    // If string parseable by Date
    if (typeof value === "string") {
      const d = new Date(value);
      if (!isNaN(d)) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const time = d.toTimeString().slice(0, 5);
        return `${day}/${month}.${year} ${time}`;
      }
    }
  } catch (_) {}
  return "--/--/---- --:--";
}

const LiveCalender = () => {
  const sportDropdownRef = useRef(null);
  const winnerDropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWinnerDropdownOpen, setIsWinnerDropdownOpen] = useState(false);
  const [selectedSportKeys, setSelectedSportKeys] = useState(["soccer"]);
  const [selectedWinnerType, setSelectedWinnerType] = useState("winner");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const toggleDropdown = () => {

    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  const handleWinnerDropdownClick = (e) => {
    e.stopPropagation();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both dropdowns
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      if (winnerDropdownRef.current && !winnerDropdownRef.current.contains(event.target)) {
        setIsWinnerDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedSportKeys.length === 0) return;
    
    setLoading(true);
    const fetchPromises = selectedSportKeys.map(sportKey => {
      const sportId = SPORT_ID_BY_KEY[sportKey];
      if (!sportId) return Promise.resolve([]);
      
      return fetchSportsEvents(sportId, false) // live_matches=false for scheduled matches
        .then((json) => {
          const list = json?.sports ?? [];
          return Array.isArray(list) ? list : [];
        })
        .catch(() => []);
    });

    Promise.all(fetchPromises)
      .then((results) => {
        const allMatches = results.flat().map(match => {
          // Find which sport this match belongs to
          const sportKey = selectedSportKeys.find(key => {
            const sportId = SPORT_ID_BY_KEY[key];
            return match.sportId === sportId || match.sport_id === sportId;
          });
          return {
            ...match,
            sportKey: sportKey || selectedSportKeys[0]
          };
        });
        setMatches(allMatches);
      })
      .finally(() => setLoading(false));
  }, [selectedSportKeys]);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const handleSportToggle = (sportKey) => {
    setSelectedSportKeys(prev => {
      if (prev.includes(sportKey)) {
        return prev.filter(key => key !== sportKey);
      } else {
        return [...prev, sportKey];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedSportKeys(SPORTS.map(sport => sport.key));
  };

  const handleDeselectAll = () => {
    setSelectedSportKeys([]);
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="w-full mt-4">
      {/* Top bar akin to screenshot: left sport dropdown + date pills */}
      <div className="flex items-center gap-3 bg-live-tertiary text-live-primary px-2 py-2 rounded">
                 {/* Sport dropdown */}
         <div className="relative  ml-2" ref={sportDropdownRef}>
                       <button
              className="flex items-center gap-2 bg-live-primary hover:bg-live-hover px-6 py-3 rounded text-sm min-w-[200px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked');
                toggleDropdown();
              }}
            >
            <span className="opacity-70">Sport</span>
            {(() => {
              if (selectedSportKeys.length === 0) {
                return <span className="font-semibold">Select Sports</span>;
              } else if (selectedSportKeys.length === 1) {
                const selectedSport = SPORTS.find(s => s.key === selectedSportKeys[0]);
                const Icon = selectedSport?.icon;
                return (
                  <>
                    {Icon && <Icon className={`w-4 h-4 ${selectedSport.color.replace('bg-','')}`} />}
                    <span className="font-semibold">{selectedSport?.sportNames?.[0] || "Sport"}</span>
                  </>
                );
              } else {
                return <span className="font-semibold">{selectedSportKeys.length} Sports</span>;
              }
            })()}
            <span className="opacity-70">{isDropdownOpen ? '▴' : '▾'}</span>
          </button>
                                          {isDropdownOpen && (
             <div className="absolute z-20 mt-1 w-[40vw] max-h-72 overflow-y-auto bg-live-tertiary border border-live rounded shadow-lg" onClick={handleDropdownClick}>
               <ul className="py-1">
                {/* All option */}
                <li className="border-b border-live">
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-live-primary">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">All Sports</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAll}
                        className="text-xs px-2 py-1 bg-live-hover hover:bg-live-primary rounded"
                      >
                        Select All
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        className="text-xs px-2 py-1 bg-live-hover hover:bg-live-primary rounded"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </li>
                
                {/* Individual sports with checkboxes */}
                {SPORTS.map((sport) => {
                  const Icon = sport.icon;
                  const isSelected = selectedSportKeys.includes(sport.key);
                  return (
                    <li key={sport.key}>
                      <label className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-live-primary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSportToggle(sport.key)}
                          className="w-4 h-4 accent-live-success"
                        />
                        <Icon className={`w-4 h-4 ${sport.color.replace('bg-','')}`} />
                        <span className="truncate flex-1">{sport.sportNames[0]}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {/* Date pills (static visuals to match layout) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["22.08 FRI","23.08 SAT","24.08 SUN","25.08 MON","26.08 TUE","27.08 WED","28.08 THU"].map((d, i) => (
            <button key={d} className={`px-3 py-1.5 rounded text-xs border border-live ${i===0 ? 'bg-live-primary' : 'bg-transparent'}`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Main content area with matches table and right sidebar */}
      <div className="flex gap-4 mt-2">
        {/* Matches table */}
                 <div className="flex-1 bg-live-tertiary text-live-primary rounded overflow-hidden">
           <div className="flex items-center text-xs uppercase tracking-wide bg-live-primary">
                           <div className="w-40 px-3 py-2 border-r border-live relative" ref={winnerDropdownRef}>
                <button
                  className="flex items-center gap-2 hover:bg-live-hover px-2 py-1 rounded text-xs uppercase tracking-wide"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWinnerDropdownOpen(!isWinnerDropdownOpen);
                  }}
                >
                 {selectedWinnerType === "winner" && "Winner"}
                 {selectedWinnerType === "handicap" && "Handicap"}
                 {selectedWinnerType === "totals" && "Totals"}
                 <span className="opacity-70">{isWinnerDropdownOpen ? '▴' : '▾'}</span>
               </button>
               {isWinnerDropdownOpen && (
                 <div className="absolute top-full left-0 mt-1 w-32 bg-live-tertiary border border-live rounded shadow-lg z-30" onClick={handleWinnerDropdownClick}>
                   <ul className="py-1">
                     <li>
                       <button
                         className={`w-full text-left px-3 py-2 text-xs hover:bg-live-primary ${selectedWinnerType === "winner" ? "bg-live-primary" : ""}`}
                         onClick={() => setSelectedWinnerType("winner")}
                       >
                         Winner
                       </button>
                     </li>
                     <li>
                       <button
                         className={`w-full text-left px-3 py-2 text-xs hover:bg-live-primary ${selectedWinnerType === "handicap" ? "bg-live-primary" : ""}`}
                         onClick={() => setSelectedWinnerType("handicap")}
                       >
                         Handicap
                       </button>
                     </li>
                     <li>
                       <button
                         className={`w-full text-left px-3 py-2 text-xs hover:bg-live-primary ${selectedWinnerType === "totals" ? "bg-live-primary" : ""}`}
                         onClick={() => setSelectedWinnerType("totals")}
                       >
                         Totals
                       </button>
                     </li>
                   </ul>
                 </div>
               )}
             </div>
             <div className="flex-1 px-3 py-2">&nbsp;</div>
             <div className="w-28 px-3 py-2 text-center border-l border-live">W1</div>
             <div className="w-28 px-3 py-2 text-center border-l border-live">-</div>
             <div className="w-28 px-3 py-2 text-center border-l border-live">W2</div>
           </div>
          <div>
            {loading ? (
              <div className="px-3 py-4 text-sm text-live-secondary">Loading…</div>
            ) : matches.length === 0 ? (
              <div className="px-3 py-4 text-sm text-live-secondary">No matches</div>
            ) : (
                             matches.map((m, idx) => {
                 const odds = extractOddsW1W2(m.markets);
                 const isSelected = selectedMatch?.eventId === m.eventId;
                 const sport = SPORTS.find(s => s.key === m.sportKey);
                 const SportIcon = sport?.icon;
                 
                 return (
                   <div 
                     key={m.eventId || idx} 
                     className={`flex items-stretch border-t border-live-primary hover:bg-live-tertiary cursor-pointer ${isSelected ? 'bg-live-tertiary' : ''}`}
                     onClick={() => handleMatchClick(m)}
                   >
                     <div className="w-40 flex items-center gap-2 px-3 py-3 text-xs text-live-secondary">
                       <span className="inline-flex items-center gap-1">
                         <span className="w-3 h-3 rounded-full bg-live-success" />
                         <span>{formatDateTime(m.openDate)}</span>
                       </span>
                     </div>
                     <div className="flex-1 px-3 py-2">
                       <div className="flex items-center gap-2 text-sm text-live-primary">
                         {SportIcon && <SportIcon className={`w-4 h-4 ${sport.color.replace('bg-','')}`} />}
                         <span>{m.eventName || ''}</span>
                       </div>
                       <div className="text-[11px] text-live-muted">{m.competitionName || ''}</div>
                     </div>
                     <div className="w-28 px-3 py-3 text-center text-sm text-live-primary">{odds.w1}</div>
                     <div className="w-28 px-3 py-3 text-center text-sm text-live-primary">-</div>
                     <div className="w-28 px-3 py-3 text-center text-sm text-live-primary">{odds.w2}</div>
                   </div>
                 );
               })
            )}
          </div>
        </div>

        {/* Right sidebar with RightEventInfoSection */}
        <div className="w-80">
                     <RightEventInfoSection 
             selectedGame={selectedMatch ? {
               team1: selectedMatch.eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '',
               team2: selectedMatch.eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '',
               timeLabel: formatDateTime(selectedMatch.openDate),
               odds: extractOddsW1W2(selectedMatch.markets),
               sport: SPORTS.find(s => s.key === selectedMatch.sportKey)
             } : null}
            onLogin={handleLogin}
            onRegister={handleRegister}
            isCompact={true}
          />
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
};

export default LiveCalender;


