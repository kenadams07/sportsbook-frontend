import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, Globe, Monitor } from "lucide-react";

const dummySports = [
  {
    name: "Football",
    icon: <span className="text-green-400">⚽</span>,
    count: 4,
    leagues: [
      {
        name: "England Professional Development League",
        count: 2,
        matches: [
          { team1: "Sheffield Wednesday U21", team2: "Watford U21", score: "1 : 0", time: "1st Half 11'" },
          { team1: "Crewe Alexandra U21", team2: "Cardiff City U21", score: "0 : 0", time: "1st Half 9'" },
        ],
      },
      {
        name: "India Shillong Premier League",
        count: 1,
        matches: [
          { team1: "Rangdajied United FC", team2: "Shillong Lajong FC (Reserves)", score: "0 : 0", time: "2nd Half 55'" },
        ],
      },
    ],
  },
  {
    name: "Basketball",
    icon: <span className="text-orange-400">🏀</span>,
    count: 1,
    leagues: [],
  },
  {
    name: "Tennis",
    icon: <span className="text-yellow-400">🎾</span>,
    count: 2,
    leagues: [],
  },
];

export default function LeftSidebarEventView() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (sport) => {
    setExpanded((prev) => ({ ...prev, [sport]: !prev[sport] }));
  };

  return (
    <aside className="w-80 bg-[#232323] border-r border-[#444] h-full flex flex-col p-2">
      {/* Search Bar */}
      <div className="mb-3 flex items-center gap-2 bg-[#181818] rounded px-2 py-1">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a competition or team"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-white flex-1 py-1 px-2"
        />
      </div>
      {/* Icon Buttons */}
      <div className="flex gap-2 mb-3 px-1">
        <button className="bg-[#353535] p-2 rounded flex items-center justify-center hover:bg-[#444]">
          <Monitor className="w-5 h-5 text-white" />
        </button>
        <button className="bg-[#353535] p-2 rounded flex items-center justify-center hover:bg-[#444]">
          <Globe className="w-5 h-5 text-white" />
        </button>
      </div>
      {/* Sports Accordions */}
      <div className="flex-1 overflow-y-auto pr-1">
        {dummySports.map((sport) => (
          <div key={sport.name} className="mb-2 bg-[#282828] rounded">
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#333] rounded"
              onClick={() => toggleExpand(sport.name)}
            >
              <div className="flex items-center gap-2">
                {sport.icon}
                <span className="text-white text-sm font-medium">{sport.name}</span>
                <span className="ml-2 text-xs bg-[#444] text-white rounded px-2 py-0.5">{sport.count}</span>
              </div>
              <div>
                {expanded[sport.name] ? (
                  <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            {expanded[sport.name] && sport.leagues.length > 0 && (
              <div className="pl-8 pb-2">
                {sport.leagues.map((league) => (
                  <div key={league.name} className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-300 text-xs">{league.name}</span>
                      <span className="ml-1 text-xs bg-[#444] text-white rounded px-1">{league.count}</span>
                    </div>
                    {league.matches.map((match, idx) => (
                      <div key={idx} className="flex flex-col bg-[#232323] rounded p-2 mb-1 border border-[#333]">
                        <span className="text-white text-xs font-semibold">{match.team1} vs {match.team2}</span>
                        <span className="text-yellow-400 text-xs">{match.score} <span className="text-gray-400">{match.time}</span></span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
