import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

const MobileEventCard = ({ 
  team1, 
  team2, 
  time, 
  odds, 
  league, 
  matchStatus,
  score1,
  score2,
  onClick,
  highlight = false,
  oddsHighlight = { w1: false, w2: false, x: false },
  sportColor = 'bg-chart-1'
}) => {
  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '-', time: '-' };
    const d = new Date(dateString);
    const date = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}`;
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  };

  const { date, time: gameTime } = formatDateTime(time);
  const isLive = matchStatus === 'IN_PLAY';

  return (
    <div 
      onClick={onClick}
      className={`
        bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 mb-3 
        border-l-4 ${highlight ? sportColor : 'border-gray-700'}
        shadow-lg hover:shadow-xl transition-all duration-200
        ${highlight ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
        cursor-pointer active:scale-[0.98]
      `}
    >
      {/* Header: League & Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[10px] text-gray-400 truncate">{league || 'League'}</span>
        </div>
        {isLive && (
          <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-white">LIVE</span>
          </div>
        )}
      </div>

      {/* Teams & Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white truncate flex-1">{team1}</span>
          {isLive && <span className="text-sm font-bold text-yellow-400 ml-2">{score1}</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white truncate flex-1">{team2}</span>
          {isLive && <span className="text-sm font-bold text-yellow-400 ml-2">{score2}</span>}
        </div>
      </div>

      {/* Date & Time */}
      {!isLive && (
        <div className="flex items-center gap-3 mb-3 text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px]">{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">{gameTime}</span>
          </div>
        </div>
      )}

      {/* Odds */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-[9px] text-gray-500 mb-1">1</div>
          <Button
            variant="outline"
            size="sm"
            className={`
              w-full h-9 px-0 text-xs font-bold
              ${oddsHighlight.w1 
                ? 'bg-yellow-400 text-black border-yellow-400' 
                : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
              }
              transition-all duration-200
            `}
          >
            {odds.w1}
          </Button>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-500 mb-1">X</div>
          <Button
            variant="outline"
            size="sm"
            className={`
              w-full h-9 px-0 text-xs font-bold
              ${oddsHighlight.x 
                ? 'bg-yellow-400 text-black border-yellow-400' 
                : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
              }
              transition-all duration-200
            `}
          >
            {odds.x || '-'}
          </Button>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-500 mb-1">2</div>
          <Button
            variant="outline"
            size="sm"
            className={`
              w-full h-9 px-0 text-xs font-bold
              ${oddsHighlight.w2 
                ? 'bg-yellow-400 text-black border-yellow-400' 
                : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
              }
              transition-all duration-200
            `}
          >
            {odds.w2}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileEventCard;
