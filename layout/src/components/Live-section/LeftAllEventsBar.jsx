import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { API_BASE } from "../../utils/Constants";
import DummyGameCard from './DummyGameCard';  // Import the DummyGameCard
import GameCard from './GameCard';

export default function LeftAllEventsBar({ selectedGame, setSelectedGame }) {
  const [selectedSportKey, setSelectedSportKey] = useState(null);
  const [sportsMatches, setSportsMatches] = useState({}); // { sportKey: { matches: [], expanded: bool, loading: bool, error } }
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSportClick = (sportKey) => {
    setSelectedSportKey(sportKey);
    setSportsMatches((prev) => {
      if (!prev[sportKey]) {
        return {
          ...prev,
          [sportKey]: { matches: [], expanded: true, loading: true, error: null },
        };
      }
      return {
        ...prev,
        [sportKey]: { ...prev[sportKey], expanded: !prev[sportKey].expanded },
      };
    });
  };

  useEffect(() => {
    if (!selectedSportKey) return;

    const sportState = sportsMatches[selectedSportKey];

    if (!sportState || (sportState.expanded && sportState.matches.length === 0 && sportState.loading)) {
      const sportId = SPORT_ID_BY_KEY[selectedSportKey];
      if (!sportId) return;

      const url = `${API_BASE}?sport_id=${sportId}&live_matches=${isLive}`;

      fetch(url, {
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((json) => {
          const matches =
            json?.data?.sports?.map((e, idx) => ({
              id: e.eventId ?? idx,
              team1: e.eventName.split(/\s+vs\.?\s+/i)[0],
              team2: e.eventName.split(/\s+vs\.?\s+/i)[1] ?? "",
              odds: {
                w1:
                  e.markets?.matchOdds?.[0]?.runners?.[0]?.backPrices?.[0]?.price?.toString() ?? "-",
                w2:
                  e.markets?.matchOdds?.[0]?.runners?.[1]?.backPrices?.[0]?.price?.toString() ?? "-",
              },
            })) || [];

          setSportsMatches((prev) => ({
            ...prev,
            [selectedSportKey]: { ...prev[selectedSportKey], matches, loading: false, error: null },
          }));
        })
        .catch((error) => {
          setSportsMatches((prev) => ({
            ...prev,
            [selectedSportKey]: { ...prev[selectedSportKey], loading: false, error: error.message },
          }));
        });
    }
  }, [selectedSportKey, isLive]);

  const filteredSPORTS = useMemo(() => {
    if (!searchQuery) return SPORTS;
    return SPORTS.filter((s) =>
      s.sportNames.some((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="p-2 flex flex-col h-full overflow-x-hidden">
      {/* Toggle Buttons - Always at the very top */}
      <div className="flex gap-2 mb-3 bg-[#181818] p-1 rounded items-center sticky top-0 z-10000">
        <Button
          variant={isLive ? "default" : "outline"}
          size="sm"
          className={`flex-1 ${isLive ? 'bg-yellow-400 text-black font-bold' : 'bg-[#232323] text-white border border-gray-600'}`}
          onClick={() => setIsLive(true)}
        >
          Live
        </Button>
        <Button
          variant={!isLive ? "default" : "outline"}
          size="sm"
          className={`flex-1 ${!isLive ? 'bg-yellow-400 text-black font-bold' : 'bg-[#232323] text-white border border-gray-600'}`}
          onClick={() => setIsLive(false)}
        >
          Prematch
        </Button>
      </div>
      <div className="mb-2 border-b border-[#333]" />
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search sport..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md bg-[#2a2a2a] text-white border border-gray-600 text-sm"
        />
      </div>
      {/* Vertical Sports List */}
      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {filteredSPORTS.map((sport) => {
          const key = sport.key;
          const state = sportsMatches[key] || {};
          return (
            <div key={key}>
              <div
                onClick={() => handleSportClick(key)}
                className="flex items-center justify-between p-2 cursor-pointer bg-[#505050] hover:bg-[#606060] rounded-md"
              >
                <div className="flex items-center gap-2">
                  <sport.icon className="w-5 h-5 text-white" />
                  <span className="text-white text-sm">{sport.sportNames[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  {state.loading && <span className="text-xs text-muted-foreground">Loading...</span>}
                  {state.error && <span className="text-xs text-red-400">Err</span>}
                  {state.expanded ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              {/* Matches list (with GameCard) */}
              {state.expanded && state.matches && state.matches.length > 0 && (
                <div className="pl-2 pt-1">
                  {state.matches.map((match, idx) => (
                    <GameCard
                      key={match.id || idx}
                      team1={match.team1}
                      team2={match.team2}
                      score1={match.score1 || 0}
                      score2={match.score2 || 0}
                      matchStatus={match.status || '1st Half'}
                      time={match.timeLabel || "00'"}
                      odds={{ w1: match.odds?.w1 || '-', x: match.odds?.x || '-', w2: match.odds?.w2 || '-' }}
                      league={sport.sportNames[0]}
                      onClick={() => setSelectedGame(match)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
