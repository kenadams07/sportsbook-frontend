import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, Search, Globe, Monitor } from "lucide-react";
import { SPORTS, SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { Button } from "../ui/button";
import GameCard from "./GameCard";

function normalize(str = "") {
  return str.trim().toLowerCase();
}

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

export default function LeftSidebarEventView({ setSelectedMatch = () => {}, setSelectedSport = () => {}, selectedMatch }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selectedType, setSelectedType] = useState("live"); 
  const [matchesBySport, setMatchesBySport] = useState({});
  const [loadingBySport, setLoadingBySport] = useState({});
  const [oddsByEventId, setOddsByEventId] = useState({});
  const [highlightedOdds, setHighlightedOdds] = useState({});
  const oddsPrevRef = useRef({});

  useEffect(() => {
    SPORTS.forEach((sport) => {
      const sportId = SPORT_ID_BY_KEY[sport.key];
      if (!sportId) return;
      setLoadingBySport((prev) => ({ ...prev, [sport.key]: true }));
      const url = `/events?sport_id=${sportId}&live_matches=${selectedType === "live"}`;
      fetch(url, { headers: { accept: "application/json" } })
        .then((res) => res.json())
        .then((json) => {
          const list = json?.sports ?? [];
          setMatchesBySport((prev) => ({ ...prev, [sport.key]: Array.isArray(list) ? list : [] }));
          // Set initial odds
          const oddsMap = { ...oddsByEventId };
          for (const e of list) {
            oddsMap[e.eventId] = extractOddsW1W2(e.markets);
          }
          setOddsByEventId(oddsMap);
          oddsPrevRef.current = oddsMap;
        })
        .catch(() => setMatchesBySport((prev) => ({ ...prev, [sport.key]: [] })))
        .finally(() => setLoadingBySport((prev) => ({ ...prev, [sport.key]: false })));
    });
  }, [selectedType]);

  // Only poll odds for the expanded sport
  useEffect(() => {
    let intervalId;
    function pollOdds() {
      const expandedSportKeys = Object.keys(expanded).filter((key) => expanded[key]);
      expandedSportKeys.forEach((sportKey) => {
        const sportId = SPORT_ID_BY_KEY[sportKey];
        if (!sportId) return;
        const url = `/events?sport_id=${sportId}&live_matches=${selectedType === "live"}`;
        fetch(url, { headers: { accept: "application/json" } })
          .then((res) => res.json())
          .then((json) => {
            const list = json?.sports ?? [];
            const oddsMap = { ...oddsByEventId };
            const highlights = { ...highlightedOdds };
            for (const e of list) {
              const newOdds = extractOddsW1W2(e.markets);
              const prevOdds = oddsPrevRef.current[e.eventId] || {};
              oddsMap[e.eventId] = newOdds;
              highlights[e.eventId] = {
                w1: prevOdds.w1 !== newOdds.w1,
                w2: prevOdds.w2 !== newOdds.w2,
              };
            }
            setOddsByEventId(oddsMap);
            setHighlightedOdds(highlights);
            oddsPrevRef.current = oddsMap;
            setTimeout(() => {
              setHighlightedOdds({});
            }, 1000);
          });
      });
    }
    intervalId = setInterval(pollOdds, 1000);
    return () => clearInterval(intervalId);
  }, [selectedType, oddsByEventId, expanded]);

  const toggleExpand = (sport) => {
    setExpanded((prev) => ({ ...prev, [sport]: !prev[sport] }));
  };

  useEffect(() => {
    // On mount, set default expanded sport and select first game
    for (const sport of SPORTS) {
      const matches = matchesBySport[sport.key] || [];
      if (matches.length > 0) {
        setExpanded((prev) => ({ ...prev, [sport.key]: true }));
        setSelectedMatch({
          ...matches[0],
          team1: matches[0].eventName?.split(/\s+vs\.?\s+/i)[0]?.trim() || '',
          team2: matches[0].eventName?.split(/\s+vs\.?\s+/i)[1]?.trim() || '',
        });
        setSelectedSport(sport);
        break;
      }
    }
  }, [matchesBySport]);

  return (
    <aside className="flex-1 bg-[#232323] h-full flex flex-col p-2 min-w-0">
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={selectedType === "live" ? "default" : "outline"}
          size="sm"
          className={`flex-1 text-xs ${selectedType === "live" ? "bg-white text-black hover:bg-white hover:text-black" : "bg-transparent border-gray-600 text-white hover:bg-white hover:text-black"}`}
          onClick={() => setSelectedType("live")}
        >
          Live
        </Button>
        <Button
          variant={selectedType === "prematch" ? "default" : "outline"}
          size="sm"
          className={`flex-1 text-xs ${selectedType === "prematch" ? "bg-white text-black hover:bg-white hover:text-black" : "bg-transparent border-gray-600 text-white hover:bg-white hover:text-black"}`}
          onClick={() => setSelectedType("prematch")}
        >
          Prematch
        </Button>
      </div>
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
        {SPORTS.map((sport) => {
          const Icon = sport.icon;
          const matches = matchesBySport[sport.key] || [];
          const matchCount = matches.length;
          return (
            <div key={sport.key} className="mb-2 bg-[#282828] rounded">
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#333] rounded"
                onClick={() => toggleExpand(sport.key)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon className={`w-5 h-5 ${sport.color.replace('bg-', '')}`} />
                  <span className="text-white text-sm font-medium truncate">{sport.sportNames[0]}</span>
                </div>
                <span className="text-xs bg-[#444] text-white rounded px-2 py-0.5 ml-2 min-w-[32px] text-center">{matchCount}</span>
                <div>
                  {expanded[sport.key] ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              {expanded[sport.key] && (
                <div className="pl-2 pb-2">
                  {loadingBySport[sport.key] ? (
                    <div className="text-xs text-gray-400 px-2 py-2">Loading…</div>
                  ) : matchCount === 0 ? (
                    <div className="text-xs text-gray-400 px-2 py-2">No matches</div>
                  ) : (
                    matches.map((match, idx) => {
                      // Robustly extract team names
                      let team1 = '';
                      let team2 = '';
                      if (match.eventName) {
                        const parts = match.eventName.split(/\s+vs\.?\s+/i);
                        team1 = parts[0]?.trim() || '';
                        team2 = parts[1]?.trim() || '';
                      }
                      const isSelected = selectedMatch && (selectedMatch.eventId === match.eventId);
                      const odds = oddsByEventId[match.eventId] || extractOddsW1W2(match.markets);
                      const highlight = highlightedOdds[match.eventId] || { w1: false, w2: false };
                      return (
                        <GameCard
                          key={match.eventId || idx}
                          team1={team1}
                          team2={team2}
                          score1={match.homeScore}
                          score2={match.awayScore}
                          matchStatus={match.status}
                          time={match.openDate}
                          odds={odds}
                          league={match.competitionName}
                          sport={sport.key}
                          highlight={isSelected}
                          oddsHighlight={highlight}
                          onClick={() => {
                            setSelectedMatch({
                              ...match,
                              team1,
                              team2,
                            });
                            setSelectedSport(sport);
                          }}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
