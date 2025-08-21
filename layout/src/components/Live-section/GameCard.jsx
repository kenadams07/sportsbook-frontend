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

  return (
    <div
      className={`bg-[#393939] rounded-md p-2 mb-2 shadow border border-[#444] ${highlight ? 'ring-2 ring-yellow-400' : ''} cursor-pointer hover:bg-[#444] transition`}
      onClick={onClick}
    >
      {/* League and status vertically */}
      <div className="flex flex-col items-start mb-1 gap-1">
        <span className="text-xs text-gray-300 font-semibold truncate">{league}</span>
        <span className="text-xs text-gray-400">{matchStatus}</span>
        <span className="text-xs text-yellow-400">{displayTime}</span>
      </div>
      {/* Teams and scores */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col flex-1">
          <span className="text-sm text-white font-bold truncate">{team1Display}</span>
          <span className="text-xs text-gray-400 font-bold">vs.</span>
          <span className="text-sm text-white font-bold truncate">{team2Display}</span>
        </div>
        <div className="flex flex-col items-end ml-2">
          <span className="text-lg text-yellow-400 font-bold">{score1}</span>
          <span className="text-lg text-yellow-400 font-bold">{score2}</span>
        </div>
      </div>
      {/* Odds */}
      <div className="flex gap-2 mt-2">
        <div className="flex-1 flex flex-col items-center bg-[#232323] rounded p-1">
          <span className="text-xs text-gray-400">W1</span>
          <span className={`text-base font-bold px-2 py-1 rounded odds-value ${oddsHighlight?.w1 ? 'odds-highlight' : ''}`}>{odds.w1}</span>
        </div>
        <div className="flex-1 flex flex-col items-center bg-[#232323] rounded p-1">
          <span className="text-xs text-gray-400">X</span>
          <span className="text-base text-yellow-300 font-bold">{odds.x}</span>
        </div>
        <div className="flex-1 flex flex-col items-center bg-[#232323] rounded p-1">
          <span className="text-xs text-gray-400">W2</span>
          <span className={`text-base font-bold px-2 py-1 rounded odds-value ${oddsHighlight?.w2 ? 'odds-highlight' : ''}`}>{odds.w2}</span>
        </div>
      </div>
    </div>
  );
}
