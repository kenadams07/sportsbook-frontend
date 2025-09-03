"use client"

import { useState } from "react"
import SecondaryEsportsNavbar from "./SecondaryEsportsNavbar"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

// Mock data for ESports games
const esportsGames = [
  { id: 1, game: "Counter-Strike 2", count: 2, color: "#f97316" }, // Orange color for CS2
  { id: 2, game: "Dota 2", count: 9, color: "#ef4444" }, // Red color for Dota 2
  { id: 3, game: "Valorant", count: 4, color: "#ec4899" }, // Pink color for Valorant
  { id: 4, game: "Rainbow Six", count: 3, color: "#3b82f6" }, // Blue color for Rainbow Six
];

// Mock data for upcoming matches
const upcomingMatches = [
  { 
    id: 1, 
    game: "Counter-Strike 2", 
    team1: "Team A", 
    team2: "Team B", 
    time: "14:30",
    date: "2025-09-03",
    odds: { w1: 1.45, w2: 2.65 }
  },
  { 
    id: 2, 
    game: "Dota 2", 
    team1: "Team C", 
    team2: "Team D", 
    time: "16:00",
    date: "2025-09-03",
    odds: { w1: 1.95, w2: 1.85 }
  },
  { 
    id: 3, 
    game: "Valorant", 
    team1: "Team E", 
    team2: "Team F", 
    time: "18:15",
    date: "2025-09-03",
    odds: { w1: 2.10, w2: 1.70 }
  },
  { 
    id: 4, 
    game: "Rainbow Six", 
    team1: "Team G", 
    team2: "Team H", 
    time: "20:00",
    date: "2025-09-03",
    odds: { w1: 1.50, w2: 2.50 }
  }
];

export default function MainEsportsSection() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [winnerDropdownOpen, setWinnerDropdownOpen] = useState(false);

  // Filter games based on search query
  const filteredGames = esportsGames.filter(
    game => game.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter matches based on selected game and filter
  const filteredMatches = upcomingMatches.filter(
    match => !selectedGame || match.game === selectedGame
  );

  const getIconByGame = (game) => {
    switch (game) {
      case "Counter-Strike 2":
        return (
          <div className="w-5 h-5 bg-[#292929] flex items-center justify-center rounded-sm" style={{ borderLeft: `2px solid ${esportsGames[0].color}` }}>
            <span className="text-xs text-white">C</span>
          </div>
        );
      case "Dota 2":
        return (
          <div className="w-5 h-5 bg-[#292929] flex items-center justify-center rounded-sm" style={{ borderLeft: `2px solid ${esportsGames[1].color}` }}>
            <span className="text-xs text-white">D</span>
          </div>
        );
      case "Valorant":
        return (
          <div className="w-5 h-5 bg-[#292929] flex items-center justify-center rounded-sm" style={{ borderLeft: `2px solid ${esportsGames[2].color}` }}>
            <span className="text-xs text-white">V</span>
          </div>
        );
      case "Rainbow Six":
        return (
          <div className="w-5 h-5 bg-[#292929] flex items-center justify-center rounded-sm" style={{ borderLeft: `2px solid ${esportsGames[3].color}` }}>
            <span className="text-xs text-white">R</span>
          </div>
        );
      default:
        return null;
    }
  };

  const CategoryIcon = ({ category }) => {
    switch (category) {
      case "All":
        return <div className="w-5 h-5 bg-[#fbbf24] flex items-center justify-center">
          <span className="text-xs text-black">A</span>
        </div>;
      case "Upcoming":
        return <div className="w-5 h-5 bg-[#14b8a6] flex items-center justify-center">
          <span className="text-xs text-black">U</span>
        </div>;
      case "Live":
        return <div className="w-5 h-5 bg-[#ef4444] flex items-center justify-center rounded-full">
          <span className="text-xs text-white">L</span>
        </div>;
      case "Results":
        return <div className="w-5 h-5 bg-[#f59e0b] flex items-center justify-center">
          <span className="text-xs text-black">R</span>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-[#1a1a1a] text-white overflow-hidden">
      {/* Secondary Navigation Bar */}
      <SecondaryEsportsNavbar />
      
      <div className="flex h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[250px] min-w-[250px] border-r border-[#333333] bg-[#1a1a1a] overflow-y-auto">
          {/* All button dropdown at top */}
          <div className="px-2 py-2 border-b border-[#333333]">
            <div className="relative p-2">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-[#222222] rounded-full flex items-center justify-center mr-3">
                  <ChevronDown className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">All</span>
              </div>
            </div>
          </div>

          {/* Search input */}
          <div className="p-2 border-b border-[#333333]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for an esports competition or team"
                className="w-full h-8 bg-[#222222] border-0 rounded px-3 py-1 text-xs text-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="h-3 w-3 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Category buttons */}
          <div className="divide-y divide-[#333333]">
            {/* All category with yellow background */}
            <div 
              className={`flex justify-between items-center p-2 cursor-pointer ${selectedCategory === "All" ? 'bg-[#fbbf24]' : 'hover:bg-[#222222]'}`}
              onClick={() => setSelectedCategory("All")}
            >
              <div className="flex items-center">
                <CategoryIcon category="All" />
                <span className={`ml-3 text-sm ${selectedCategory === "All" ? 'text-black' : 'text-white'}`}>All</span>
              </div>
              <ChevronRight className={`h-5 w-5 ${selectedCategory === "All" ? 'text-black' : 'text-white'}`} />
            </div>

            {/* Upcoming category */}
            <div 
              className={`flex justify-between items-center p-2 cursor-pointer ${selectedCategory === "Upcoming" ? 'bg-[#222222]' : 'hover:bg-[#222222]'}`}
              onClick={() => setSelectedCategory("Upcoming")}
            >
              <div className="flex items-center">
                <CategoryIcon category="Upcoming" />
                <span className="ml-3 text-sm">Upcoming</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </div>

            {/* Live category */}
            <div 
              className={`flex justify-between items-center p-2 cursor-pointer ${selectedCategory === "Live" ? 'bg-[#222222]' : 'hover:bg-[#222222]'}`}
              onClick={() => setSelectedCategory("Live")}
            >
              <div className="flex items-center">
                <CategoryIcon category="Live" />
                <span className="ml-3 text-sm">Live</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </div>

            {/* Results category */}
            <div 
              className={`flex justify-between items-center p-2 cursor-pointer ${selectedCategory === "Results" ? 'bg-[#222222]' : 'hover:bg-[#222222]'}`}
              onClick={() => setSelectedCategory("Results")}
            >
              <div className="flex items-center">
                <CategoryIcon category="Results" />
                <span className="ml-3 text-sm">Results</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </div>

            {/* Game Categories */}
            {filteredGames.map(game => (
              <div 
                key={game.id}
                className={`flex justify-between items-center p-2 cursor-pointer ${selectedGame === game.game ? 'bg-[#222222]' : 'hover:bg-[#222222]'}`}
                onClick={() => setSelectedGame(game.game === selectedGame ? null : game.game)}
              >
                <div className="flex items-center">
                  {getIconByGame(game.game)}
                  <span className="ml-3 text-sm">{game.game}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2">{game.count}</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Game listings */}
          <div className="p-4">
            {filteredMatches.map(match => (
              <div key={match.id} className="mb-4 border border-[#333333] rounded overflow-hidden">
                <div className="flex justify-between items-center p-3 bg-[#272727]">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 bg-[#333333] mr-2 text-center text-xs leading-6 rounded-sm">
                      {match.game.substring(0, 1)}
                    </span>
                    <span className="text-sm">{match.game}</span>
                  </div>
                  <span className="text-xs text-gray-400">{match.time}</span>
                </div>
                
                <div className="p-3 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium mb-1">{match.team1}</div>
                      <div className="text-sm font-medium">{match.team2}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="bg-[#333333] px-3 py-1 rounded text-sm text-yellow-400">
                        {match.odds.w1.toFixed(2)}
                      </div>
                      <div className="bg-[#333333] px-3 py-1 rounded text-sm text-yellow-400">
                        {match.odds.w2.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-[300px] min-w-[300px] border-l border-[#333333] bg-[#1a1a1a] p-4 overflow-y-auto">
          {/* Betting Slip */}
          <div className="bg-[#272727] rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold">BetSlip</h2>
              <div className="flex items-center">
                <button className="text-xs text-gray-400 hover:text-white">Always ask</button>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs">Single</span>
              <button className="text-xs text-gray-400 hover:text-white">Remove All</button>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-md p-3 mb-3">
              <div className="text-xs mb-1 font-bold">Russia (1.25)</div>
              <div className="text-xs text-gray-400 mb-1">Goals Asian Handicap</div>
              <div className="text-xs text-gray-400 mb-1">Russia - Jordan</div>
              <div className="text-xs text-gray-400">04.09.2025, 21:00</div>
            </div>
            
            <div className="mb-4">
              <input 
                type="text"
                placeholder="Enter stake"
                className="w-full h-10 bg-[#333333] border-0 rounded px-4 py-2 text-sm text-white placeholder-gray-500"
              />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs">Possible win:</span>
              <span className="text-xs text-yellow-400 font-bold">0 €</span>
            </div>
            
            <div className="flex justify-center items-center mb-4 text-xs text-gray-400">
              <span className="mr-1">⚠️</span>
              <span>To place your bet, please </span>
              <a href="#" className="text-yellow-400 mx-1">sign in</a>
              <span>or</span>
              <a href="#" className="text-yellow-400 ml-1">register</a>
            </div>
            
            <div className="flex justify-between gap-2 mb-4">
              <button className="flex-1 bg-[#333333] text-white text-xs py-2 rounded">5</button>
              <button className="flex-1 bg-[#333333] text-white text-xs py-2 rounded">10</button>
              <button className="flex-1 bg-[#333333] text-white text-xs py-2 rounded">50</button>
              <button className="w-10 bg-[#333333] text-white text-xs py-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            
            <button className="w-full bg-[#333333] text-white text-sm py-2 rounded">
              BET
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}