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

export default function RightEventInfoSection({ selectedGame, onLogin, onRegister, isCompact = false }) {
  const [oddsOption, setOddsOption] = useState('always ask');

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center h-full text-live-muted text-sm bg-gradient-to-b from-live-tertiary to-live-secondary rounded p-4 shadow-md">
        Select a game to see details
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="p-3 m-2 bg-live-primary rounded-lg border border-live-accent shadow-live flex flex-col gap-3 text-live-primary">
        {/* MY TEAMS Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-live-primary">MY TEAMS</h3>
          <button className="w-full flex items-center gap-2 bg-live-primary hover:bg-live-hover px-3 py-2 rounded text-sm">
            <span className="text-live-accent">★</span>
            <span>Add Your Favorites</span>
          </button>
        </div>

        {/* Empty Content Area */}
        <div className="bg-live-secondary rounded p-4 flex items-center justify-center">
          <div className="text-live-muted text-xs">Empty content area</div>
        </div>

        {/* BetSlip Section */}
        <div className="space-y-2">
          <div className="bg-live-tertiary px-3 py-2 rounded border border-live-accent text-center">
            <span className="text-sm font-bold text-live-accent">BetSlip</span>
          </div>
          <div className="bg-live-tertiary px-3 py-2 rounded border border-live flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-live-accent">⚙️</span>
              <span className="text-sm text-live-primary">Always ask</span>
            </div>
            <span className="text-live-accent">▾</span>
          </div>
          <div className="bg-live-tertiary px-3 py-2 rounded border border-live text-center">
            <span className="text-xs text-live-secondary">Your betslip is empty</span>
          </div>
          <div className="bg-live-tertiary px-3 py-2 rounded border border-live flex items-center gap-1 text-xs whitespace-nowrap">
            <span className="text-live-warning">⚠️</span>
            <span className="text-live-primary">To place your bet, please</span>
            <button onClick={onLogin} className="text-live-info underline hover:text-live-accent">Sign in</button>
            <span className="text-live-primary">or</span>
            <button onClick={onRegister} className="text-live-info underline hover:text-live-accent">Register</button>
          </div>
        </div>

        {/* Betting Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button className="flex-1 bg-live-tertiary hover:bg-live-hover border border-live px-3 py-2 rounded text-sm font-medium text-live-primary transition-colors">5</button>
            <button className="flex-1 bg-live-tertiary hover:bg-live-hover border border-live px-3 py-2 rounded text-sm font-medium text-live-primary transition-colors">10</button>
            <button className="flex-1 bg-live-tertiary hover:bg-live-hover border border-live px-3 py-2 rounded text-sm font-medium text-live-primary transition-colors">50</button>
            <button className="bg-live-tertiary hover:bg-live-hover border border-live px-3 py-2 rounded text-sm font-medium text-live-primary transition-colors">✏️</button>
          </div>
          <button className="w-full bg-live-accent hover:bg-live-warning border border-live-accent text-live-dark px-3 py-2 rounded text-sm font-bold transition-colors">BET</button>
        </div>
      </div>
    );
  }
  console.log("selectedGame",selectedGame);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
      <div className="flex flex-col gap-3 py-2">
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
          <span className="text-sm font-bold text-live-accent px-3 py-1 bg-live-tertiary rounded-full border border-live-accent">
            BetSlip
          </span>
          <div className="h-px flex-1 bg-live-accent opacity-30"></div>
        </div>

        {/* Login/Register CTA */}
        <div className="text-center text-xs text-live-muted bg-live-tertiary p-3 rounded-lg border border-live">
          <p>If you want to place a bet, please<LinkTo onClick={onLogin} text="login" /> or<LinkTo onClick={onRegister} text="register" /></p>
        </div>
      </div>

              {/* Event Info Section */}
        <div className="bg-live-tertiary p-4 rounded-lg border border-live-accent shadow-live">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-live">
              <span className="text-live-secondary text-sm font-medium">Team 1:</span>
              <span className="text-sm text-live-accent font-semibold">{selectedGame.team1}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-live">
              <span className="text-live-secondary text-sm font-medium">Team 2:</span>
              <span className="text-sm text-live-accent font-semibold">{selectedGame.team2}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-live">
              <span className="text-live-secondary text-sm font-medium">Time:</span>
              <span className="text-sm text-live-accent font-semibold">{formatDateTime(selectedGame.timeLabel)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-live-secondary text-sm font-medium">Odds:</span>
              <span className="text-sm text-live-accent font-semibold">
                W1: {selectedGame.odds.w1} | W2: {selectedGame.odds.w2}
              </span>
            </div>
          </div>
        </div>

      {/* Placeholder for Additional Stats */}
      <div className="bg-live-tertiary p-6 rounded-lg border border-live-accent shadow-live flex items-center justify-center text-center h-28">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-live-hover rounded-full flex items-center justify-center mx-auto border border-live-accent">
            <span className="text-live-accent text-xl">📊</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-live-primary">Advanced Match Analytics</span>
            <span className="block text-xs text-live-muted">Team Stats + Predictions</span>
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