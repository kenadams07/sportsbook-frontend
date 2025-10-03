import React from "react";

export default function GameCard({
  team1,
  team2,
  score1,
  score2,
  matchStatus,
  time,
  odds,
  league,
  sport, // <-- Add sport prop
  sportKey, // <-- Add sportKey prop
  highlight = false,
  oddsHighlight = { w1: false, w2: false },
  onClick,
}) {
  let team1Display = team1;
  let team2Display = team2;
  if (team1 && !team2) {
    const parts = team1.split(/\s*vs\.?\s*/i);
    if (parts.length === 2) {
      team1Display = parts[0].trim();
      team2Display = parts[1].trim();
    }
  }

  // Convert time if it's a timestamp (e.g., openDate)
  let displayTime = time;
  if (typeof time === 'number' && time > 1000000000000) {
    const dateObj = new Date(time);
    displayTime = dateObj.toLocaleString();
  }

  // Check if market is suspended
  const isSuspended = odds.w1 === "SUSPENDED" && odds.x === "SUSPENDED" && odds.w2 === "SUSPENDED";

  return (
    <div
      className={`bg-live-primary rounded-md p-2 mb-2 border transition-all duration-300 ease-in-out transform ${
        highlight 
          ? 'border-live-accent shadow-[0_0_12px_var(--live-accent-primary)] scale-[1.02]' 
          : 'border-live shadow-md hover:shadow-lg'
      } cursor-pointer hover:bg-live-hover hover:scale-[1.01]`}
      onClick={onClick}
      data-sport-key={sportKey} // Add data attribute for debugging
      data-event-id={time} // Add data attribute for debugging
    >
      {/* League and status vertically */}
      <div className="flex flex-col items-start mb-1 gap-1">
        <span className="text-xs text-live-secondary font-semibold truncate">{league}</span>
        <span className="text-xs text-live-muted">{matchStatus}</span>
        <span className="text-xs text-live-accent">{displayTime}</span>
      </div>
      {/* Teams and scores */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col flex-1">
          <span className="text-sm text-live-primary font-bold truncate">{team1Display}</span>
          <span className="text-xs text-live-muted font-bold">vs.</span>
          <span className="text-sm text-live-primary font-bold truncate">{team2Display}</span>
        </div>
        <div className="flex flex-col items-end ml-2">
          <span className="text-lg text-live-accent font-bold">{score1}</span>
          <span className="text-lg text-live-accent font-bold">{score2}</span>
        </div>
      </div>
      {/* Odds */}
      <div className="flex gap-2 mt-2">
        {isSuspended ? (
          // Display full suspended box
          <div className="w-full flex items-center justify-center bg-live-odds rounded p-2">
            <span className="text-sm font-bold text-live-primary">SUSPENDED</span>
          </div>
        ) : (
          // Display regular odds
          <>
            <div className="flex-1 flex flex-col items-center bg-live-odds rounded p-1 transition-all duration-200 hover:scale-105">
              <span className="text-xs text-live-muted">W1</span>
              <span className={`text-base font-bold px-2 py-1 rounded odds-value transition-all duration-300 ${
                oddsHighlight?.w1 
                  ? 'odds-highlight shadow-[0_0_8px_var(--live-accent-primary)] scale-110' 
                  : 'hover:shadow-md'
              }`}>{odds.w1}</span>
            </div>
            <div className="flex-1 flex flex-col items-center bg-live-odds rounded p-1 transition-all duration-200 hover:scale-105">
              <span className="text-xs text-live-muted">X</span>
              <span className="text-base text-live-accent font-bold transition-all duration-300 hover:shadow-md">{odds.x}</span>
            </div>
            <div className="flex-1 flex flex-col items-center bg-live-odds rounded p-1 transition-all duration-200 hover:scale-105">
              <span className="text-xs text-live-muted">W2</span>
              <span className={`text-base font-bold px-2 py-1 rounded odds-value transition-all duration-300 ${
                oddsHighlight?.w2 
                  ? 'odds-highlight shadow-[0_0_8px_var(--live-accent-primary)] scale-110' 
                  : 'hover:shadow-md'
              }`}>{odds.w2}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}