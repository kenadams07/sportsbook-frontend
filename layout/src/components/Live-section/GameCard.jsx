import React from "react";

/**
 * Props:
 * - team1, team2: string
 * - score1, score2: string or number
 * - matchStatus: string (e.g. '1st Half')
 * - time: string (e.g. "33'")
 * - odds: { w1: string|number, x: string|number, w2: string|number }
 * - league: string
 * - highlight?: boolean
 * - onClick?: function
 */
export default function GameCard({
  team1,
  team2,
  score1,
  score2,
  matchStatus,
  time,
  odds,
  league,
  highlight = false,
  onClick,
}) {
  return (
    <div
      className={`bg-[#393939] rounded-md p-2 mb-2 shadow border border-[#444] ${highlight ? 'ring-2 ring-yellow-400' : ''} cursor-pointer hover:bg-[#444] transition`}
      onClick={onClick}
    >
      {/* League and status */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300 font-semibold flex-1 truncate">{league}</span>
        <span className="text-xs text-gray-400 ml-2">{matchStatus} <span className="text-yellow-400">{time}</span></span>
      </div>
      {/* Teams and scores */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex flex-col flex-1">
          <span className="text-sm text-white font-bold truncate">{team1}</span>
          <span className="text-sm text-white font-bold truncate">{team2}</span>
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
          <span className="text-base text-yellow-300 font-bold">{odds.w1}</span>
        </div>
        <div className="flex-1 flex flex-col items-center bg-[#232323] rounded p-1">
          <span className="text-xs text-gray-400">X</span>
          <span className="text-base text-yellow-300 font-bold">{odds.x}</span>
        </div>
        <div className="flex-1 flex flex-col items-center bg-[#232323] rounded p-1">
          <span className="text-xs text-gray-400">W2</span>
          <span className="text-base text-yellow-300 font-bold">{odds.w2}</span>
        </div>
      </div>
    </div>
  );
}
