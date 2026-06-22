"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoSearchOutline, IoCloseOutline, IoChevronDown, IoChevronUp, IoStarOutline } from "react-icons/io5";
import { SPORT_ID_BY_KEY } from "../../utils/CommonExports";
import { fetchMarketsData } from "../../utils/sportsEventsApi";

const sportImageMap = {
  soccer: "/assets/img1.jpg",
  football: "/assets/img2.jpg",
  basketball: "/assets/img3.jpg",
  tennis: "/assets/img4.jpg",
  cricket: "/assets/img4.jpg",
  baseball: "/assets/img2.jpg",
  hockey: "/assets/img3.jpg",
  volleyball: "/assets/img4.jpg",
};

const isMatchSuspended = (match) => {
  // Check if match status is suspended
  if (match?.status === "SUSPENDED") return true;
  
  // Check if all odds are suspended (existing logic from GameCard)
  const odds = match?.odds || {};
  if (odds.w1 === "SUSPENDED" && odds.x === "SUSPENDED" && odds.w2 === "SUSPENDED") return true;
  
  // Check if markets are suspended
  const markets = match?.markets?.matchOdds?.[0];
  if (markets?.status === "SUSPENDED") return true;
  
  return false;
};

const MARKET_NAME_BY_KEY = {
  matchOdds: "Match Odds",
  h2h: "Match Odds",
  spreads: "Handicap",
  totals: "Totals",
  outrights: "Outrights",
};

const MARKET_CATEGORY_TABS = [
  { id: "All", label: "All" },
  { id: "Match", label: "Match" },
  { id: "Totals", label: "Totals" },
  { id: "Handicaps", label: "Handicaps" },
  { id: "Halves", label: "Halves" },
  { id: "Outrights", label: "Outrights" },
];

function humanizeMarketName(value = "") {
  if (MARKET_NAME_BY_KEY[value]) {
    return MARKET_NAME_BY_KEY[value];
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getMarketCategory(market = {}) {
  const raw = [
    market.marketCategory,
    market.marketGroupKey,
    market.key,
    market.marketType,
    market.marketName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (raw.includes("outright") || raw.includes("winner")) {
    return "Outrights";
  }

  if (raw.includes("spread") || raw.includes("handicap") || raw.includes("asian handicap")) {
    return "Handicaps";
  }

  if (raw.includes("total") || raw.includes("over") || raw.includes("under") || raw.includes("goal")) {
    return "Totals";
  }

  if (raw.includes("half") || raw.includes("1st") || raw.includes("2nd")) {
    return "Halves";
  }

  return "Match";
}

function normaliseMarket(market, marketGroupKey = "market", marketIndex = 0) {
  const rawMarketName = market.marketName || market.marketType || market.key || marketGroupKey;
  const marketName = humanizeMarketName(rawMarketName);
  const marketKey = market.key || market.marketType || marketGroupKey;
  const categoryInput = {
    ...market,
    marketGroupKey,
    key: marketKey,
    marketName,
  };

  return {
    ...market,
    marketGroupKey,
    marketKey,
    marketCategory: getMarketCategory(categoryInput),
    marketId: market.marketId || marketGroupKey + "-" + marketIndex,
    marketName,
    runners: (market.runners || []).map((runner, runnerIndex) => ({
      ...runner,
      runnerId: runner.runnerId || marketGroupKey + "-" + marketIndex + "-" + runnerIndex,
    })),
  };
}

function normaliseMarketsForDisplay(markets) {
  if (!markets) {
    return [];
  }

  if (Array.isArray(markets)) {
    return markets.map((market, marketIndex) => normaliseMarket(market, market.key || market.marketType || "market", marketIndex));
  }

  return Object.entries(markets).flatMap(([marketGroupKey, marketList]) => {
    if (!Array.isArray(marketList)) {
      return [];
    }

    return marketList.map((market, marketIndex) => normaliseMarket(market, marketGroupKey, marketIndex));
  });
}

function getMatchTeams(match = {}) {
  if (match.eventType === "OUTRIGHT") {
    return {
      team1: match.eventName || match.competitionName || "Outright",
      team2: "",
    };
  }

  const parts = (match.eventName || "").split(/\s+vs\.?\s+/i);

  return {
    team1: match.team1 || parts[0]?.trim() || match.homeTeam || "Team 1",
    team2: match.team2 || parts[1]?.trim() || match.awayTeam || "Team 2",
  };
}

function extractBoardOdds(match = {}) {
  if (match.odds) {
    return {
      w1: match.odds.w1 || "-",
      x: match.odds.x || "-",
      w2: match.odds.w2 || "-",
    };
  }

  const market = match.markets?.matchOdds?.[0] || normaliseMarketsForDisplay(match.markets)[0];
  const runners = market?.runners || [];
  const drawRunner = runners.find((runner) => runner.runnerName?.toLowerCase?.() === "draw");
  const nonDrawRunners = runners.filter((runner) => runner.runnerName?.toLowerCase?.() !== "draw");
  const firstRunner = nonDrawRunners[0];
  const secondRunner = nonDrawRunners.length > 1 ? nonDrawRunners[nonDrawRunners.length - 1] : undefined;
  const formatPrice = (runner) => {
    const price = runner?.backPrices?.[0]?.price;
    return typeof price === "number" ? price.toFixed(2) : "-";
  };

  return {
    w1: formatPrice(firstRunner),
    x: formatPrice(drawRunner),
    w2: formatPrice(secondRunner),
  };
}

function formatBoardDate(value) {
  const date = new Date(value || Date.now());

  if (Number.isNaN(date.getTime())) {
    return "Date TBA";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatBoardTime(value) {
  const date = new Date(value || Date.now());

  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MiddleGameDisplay({ match, sport, onRunnerSelect, eventBoardMatches = [], boardViewMode = "live", onMatchSelect = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  if (boardViewMode === "prematch") {
    return (
      <PrematchEventBoard
        matches={eventBoardMatches}
        selectedMatch={match}
        onMatchSelect={onMatchSelect}
        onRunnerSelect={onRunnerSelect}
      />
    );
  }

  if (!match || !sport) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-full text-live-muted text-sm">
        <div className="flex flex-col items-center justify-center animate-pulse-scale">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-4 text-live-primary text-sm font-medium">Loading game details...</p>
        </div>
      </div>
    );
  }

  const sportKey =
    match?.sportKey || // From match object (when passed from LeftSidebarEventView)
    sport?.key?.toLowerCase?.() || // From sport prop (when passed from MainLiveSection)
    sport?.name?.toLowerCase?.() ||
    sport?.toLowerCase?.() ||
    "";

  const imageSrc = sportImageMap[sportKey] || "/assets/img1.jpg";

  // Convert openDate/time to readable format
  let displayTime = match.time || match.openDate;
  if (typeof displayTime === "number" && displayTime > 1000000000000) {
    const dateObj = new Date(displayTime);
    displayTime = dateObj.toLocaleString();
  }

    const isOutright = match.eventType === "OUTRIGHT";
  const teamNames = !isOutright && match.eventName ? match.eventName.split(/\s+vs\.?\s+/i) : [match.eventName || match.team1 || "Outright", ""];
  const team1 = isOutright ? (match.eventName || match.team1 || "Outright") : (teamNames[0] || "Team 1");
  const team2 = isOutright ? "" : (teamNames[1] || "Team 2");

  // Use real-time scores from match prop
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;

  const matchIsSuspended = isMatchSuspended(match);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 h-full min-w-0 w-full">
      {/* Top Section with Background Image - Responsive height */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden flex-shrink-0">
        {/* Background Image */}
         <img
          src={imageSrc}
          alt={sport?.sportNames?.[0] || sportKey}
          className="w-full h-full object-cover absolute left-0 top-0"
          style={{ zIndex: 0 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/img1.jpg";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col text-white">
          {/* Top section with flag and competition */}
          <div className="flex justify-between items-center p-2 sm:p-3 md:p-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-5 h-3 sm:w-6 sm:h-4 bg-live-info border border-live-primary rounded-sm flex items-center justify-center">
                <span className="text-live-primary text-[10px] sm:text-xs font-bold">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§</span>
              </div>
              <span className="text-live-primary text-xs sm:text-sm font-medium truncate">{match.competitionName || 'League'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`text-live-dark text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-live-accent rounded ${match.status === 'IN_PLAY' ? 'animate-pulse-highlight in-play-golden' : ''}`}>
                {match.status === 'IN_PLAY' ? 'IN PLAY' : (match.status || 'N/A')}
              </span>
           
            </div>
          </div>

          {/* Middle section with teams and scores */}
          <div className="flex-1 flex items-center justify-between px-2 sm:px-3 md:px-4">
            <div className="w-full flex items-center justify-between" style={{ background: "rgba(0,0,0,0.4)", padding: "8px 12px", borderRadius: "8px" }}>
              {/* Left side - Teams */}
              <div className="space-y-1 sm:space-y-2 md:space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <span className="text-live-danger text-sm sm:text-base md:text-lg">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦</span>
                  <span className="text-live-primary text-sm sm:text-base md:text-lg font-medium truncate">{team1}</span>
                </div>
                {isOutright ? (
                  <div className="text-live-muted text-xs sm:text-sm font-semibold">Outright winner market</div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-live-accent text-sm sm:text-base md:text-lg">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¹Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦</span>
                    <span className="text-live-primary text-sm sm:text-base md:text-lg font-medium truncate">{team2}</span>
                  </div>
                )}
              </div>

        

              {/* Right side - Current scores */}
              {!isOutright && (
                <div className="text-right space-y-1 sm:space-y-2 md:space-y-3 flex-shrink-0 ml-2">
                  <div className="text-live-primary text-lg sm:text-xl md:text-2xl font-bold">{homeScore}</div>
                  <div className="text-live-primary text-lg sm:text-xl md:text-2xl font-bold">{awayScore}</div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom center - Action buttons */}
          <div className="flex justify-center pb-2 sm:pb-3 md:pb-4">
            <div className="flex gap-1 sm:gap-2">
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-[10px] sm:text-xs md:text-sm">
                Stats
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-1 sm:p-1.5 md:p-2 rounded text-xs sm:text-sm">
                ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-1 sm:p-1.5 md:p-2 rounded text-xs sm:text-sm">
                ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â 
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Section - Scrollable area */}
      <div className="flex-grow overflow-hidden flex flex-col min-h-0">
        {matchIsSuspended ? (
          // Show suspended message instead of markets for suspended matches
          <div className="flex-grow flex items-center justify-center bg-live-tertiary rounded p-2 sm:p-3 md:p-4">
            <div className="text-center">
              <div className="text-live-primary text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2">Match Suspended</div>
              <div className="text-live-muted text-[10px] sm:text-xs md:text-sm">Markets are not available for suspended matches</div>
            </div>
          </div>
        ) : (
          <MarketSection 
            selectedMatch={match} 
            onRunnerSelect={onRunnerSelect}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
          />
        )}
      </div>
    </div>
  );
}

function PrematchEventBoard({ matches = [], selectedMatch, onMatchSelect, onRunnerSelect }) {
  const [boardSearch, setBoardSearch] = useState("");

  // Accordion open state per date group and refs for measuring height
  const [openDates, setOpenDates] = useState({});
  const groupRefs = useRef({});
  const groupedMatches = useMemo(() => {
    const search = boardSearch.trim().toLowerCase();
    const filtered = matches
      .filter((match) => match?.eventId)
      .filter((match) => {
        if (!search) return true;
        const haystack = [match.eventName, match.competitionName, match.sportKey, match.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      })
      .sort((a, b) => new Date(a.openDate || a.commenceTime || 0).getTime() - new Date(b.openDate || b.commenceTime || 0).getTime());

    return filtered.reduce((groups, match) => {
      const dateKey = formatBoardDate(match.openDate || match.commenceTime);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
      return groups;
    }, {});
  }, [matches, boardSearch]);

  // Open all date groups by default when groups are first computed
  useEffect(() => {
    const keys = Object.keys(groupedMatches || {});
    if (keys.length > 0 && Object.keys(openDates).length === 0) {
      const initial = {};
      keys.forEach((k) => (initial[k] = true));
      setOpenDates(initial);
    }
  }, [groupedMatches]);

  const totalMatches = Object.values(groupedMatches).reduce((total, items) => total + items.length, 0);

  const selectedTeams = getMatchTeams(selectedMatch || {});
  const selectedTitle = selectedTeams.team2 ? selectedTeams.team1 + " vs " + selectedTeams.team2 : selectedTeams.team1;
  const selectedMarketCount = selectedMatch ? normaliseMarketsForDisplay(selectedMatch.markets).length : 0;

  return (
    <div className="h-full min-h-0 w-full bg-live-primary px-2 py-2 text-live-primary">
      <div className="grid h-full min-h-0 grid-cols-[minmax(420px,1.3fr)_minmax(360px,0.9fr)] gap-2">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-live bg-live-secondary">
        <div className="flex items-center justify-between gap-3 border-b border-live bg-live-tertiary px-3 py-2">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wide text-live-primary">Prematch Event Board</div>
            <div className="text-[11px] text-live-muted">{totalMatches} events grouped by date</div>
          </div>
          <div className="flex min-w-[220px] items-center gap-2 rounded border border-live bg-live-primary px-2 py-1.5">
            <IoSearchOutline className="h-4 w-4 text-live-muted" />
            <input
              value={boardSearch}
              onChange={(event) => setBoardSearch(event.target.value)}
              placeholder="Search events"
              className="w-full bg-transparent text-xs text-live-primary outline-none placeholder:text-live-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-[minmax(180px,1fr)_80px_72px_72px_72px_72px]  items-center gap-1 border-b border-live bg-live-hover px-3 py-2 text-[11px] font-bold uppercase text-live-muted ">
          <div>Event</div>
          <div className="text-center">Time</div>
          <div className="text-center">W1</div>
          <div className="text-center">X</div>
          <div className="text-center">W2</div>
          <div className="text-center">More</div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar ">
          {totalMatches === 0 ? (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-live-muted">
              No prematch events available for the current selection.
            </div>
          ) : (
            Object.entries(groupedMatches).map(([dateLabel, dateMatches]) => (
              <div key={dateLabel} className="border-b border-live/70 last:border-b-0">
                <div className="sticky top-0 z-10 bg-live-primary shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenDates((prev) => ({ ...prev, [dateLabel]: !prev[dateLabel] }))}
                    className="w-full flex items-center  justify-between px-3 py-2 text-xs font-bold text-live-accent"
                    aria-expanded={!!openDates[dateLabel]}
                  >
                    <span>{dateLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-live-tertiary px-2 py-0.5 text-[10px] text-live-muted">{dateMatches.length}</span>
                      <span className={["transition-transform duration-200", openDates[dateLabel] ? "rotate-180" : "rotate-0"].join(" ") }>
                        {openDates[dateLabel] ? <IoChevronUp className="h-4 w-4 text-live-muted" /> : <IoChevronDown className="h-4 w-4 text-live-muted" />}
                      </span>
                    </div>
                  </button>
                </div>

                <div
                  ref={(el) => (groupRefs.current[dateLabel] = el)}
                  style={{
                    maxHeight: openDates[dateLabel] ? (groupRefs.current[dateLabel]?.scrollHeight || 0) + "px" : "0px",
                    transition: "max-height 260ms ease",
                    overflow: "hidden",
                  }}
                >
                  
                  {dateMatches.map((event) => {
                    const teams = getMatchTeams(event);
                    const odds = extractBoardOdds(event);
                    const active = selectedMatch?.eventId && String(selectedMatch.eventId) === String(event.eventId);
                    const marketCount = normaliseMarketsForDisplay(event.markets).length;
                    const eventTitle = teams.team2 ? teams.team1 + " vs " + teams.team2 : teams.team1;
                    const oddsHighlight = event.oddsHighlight || {};

                    return (
                      <button
                        key={event.eventId}
                        type="button"
                        onClick={() => onMatchSelect({
                          ...event,
                          ...teams,
                          odds,
                          sportKey: event.sportKey,
                        })}
                        className={[
                          "grid w-full my-2 rounded-md grid-cols-[minmax(180px,1fr)_80px_72px_72px_72px_72px] items-center gap-1 border-t border-live/60 px-3 py-2 text-left transition-colors duration-150 active:scale-[0.998]",
                          active ? "bg-live-odds/60 shadow-[inset_3px_0_0_#ffc400]" : "bg-live-secondary hover:bg-live-hover",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-live-primary">{eventTitle}</div>
                          <div className="mt-0.5 flex min-w-0 items-center gap-2 text-[10px] text-live-muted">
                            <span className="truncate">{event.competitionName || event.sportKey || "League"}</span>
                            <span className="rounded bg-live-tertiary px-1.5 py-0.5 uppercase">{event.status || "PRE_MATCH"}</span>
                          </div>
                        </div>
                        <div className="text-center text-xs text-live-muted">{formatBoardTime(event.openDate || event.commenceTime)}</div>
                        {[
                          { value: odds.w1, key: "w1" },
                          { value: odds.x, key: "x" },
                          { value: odds.w2, key: "w2" },
                        ].map((odd) => (
                          <div
                            key={odd.key}
                            className={[
                              "mx-auto flex min-h-[30px] w-full max-w-[64px] items-center justify-center rounded px-2 text-xs font-bold transition-colors duration-150 cursor-pointer",
                              oddsHighlight[odd.key] ? "odds-highlight text-live-primary" : "bg-live-hover text-live-accent",
                            ].join(" ")}
                          >
                            {odd.value}
                          </div>
                        ))}
                        <div className="text-center text-[11px] font-semibold text-live-muted">+{marketCount}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        </div>

        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-live bg-live-secondary">
          {selectedMatch ? (
            <>
              <div className="relative h-36 flex-shrink-0 overflow-hidden border-b border-live bg-live-tertiary">
                <img
                  src="/assets/img1.jpg"
                  alt={selectedTitle}
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-live-secondary" />
                <div className="relative z-10 flex h-full flex-col justify-between p-3">
                  <div className="flex items-center justify-between gap-2 text-[10px] text-live-muted">
                    <span className="truncate rounded bg-live-primary/70 px-2 py-1 font-semibold uppercase">{selectedMatch.competitionName || selectedMatch.sportKey || "League"}</span>
                    <span className="rounded bg-live-accent px-2 py-1 font-bold text-live-dark">{selectedMatch.status || "PRE_MATCH"}</span>
                  </div>
                  <div className="rounded bg-black/35 px-3 py-2">
                    <div className="text-sm font-bold text-live-primary">{selectedTitle}</div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-live-muted">
                      <span>{formatBoardDate(selectedMatch.openDate || selectedMatch.commenceTime)}</span>
                      <span>{formatBoardTime(selectedMatch.openDate || selectedMatch.commenceTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-live-muted">
                    <span>Selected event markets</span>
                    <span className="rounded bg-live-primary/75 px-2 py-0.5 text-live-accent">{selectedMarketCount} markets</span>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <MarketSection
                  selectedMatch={selectedMatch}
                  onRunnerSelect={onRunnerSelect}
                  searchTerm=""
                  onSearchChange={() => {}}
                  onSearchClear={() => {}}
                />
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-live bg-live-tertiary text-live-accent">
                  <IoStarOutline className="h-5 w-5" />
                </div>
                <div className="text-sm font-bold text-live-primary">Select an event</div>
                <div className="mt-1 max-w-[260px] text-xs leading-5 text-live-muted">
                  Click any prematch row to view its markets and place bets from the right panel.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MarketItem Component - Displays a single market with its runners and odds
 */
function MarketItem({ market, isOpen, onToggle, highlightedOdds = {}, onRunnerSelect, selectedMatch }) {
  const runners = market.runners || [];
  const isOutright = market.marketType === "OUTRIGHT" || market.key === "outrights" || market.marketName?.toLowerCase?.().includes("winner");
  const gridClass = isOutright || runners.length > 3 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-3";

  function getOdds(runner) {
    if (!runner || runner.status === "SUSPENDED") return "SUSPENDED";
    const price = runner.backPrices?.[0]?.price;
    return typeof price === "number" ? price.toFixed(2) : "-";
  }

  function isSelectedRunner(runner) {
    return Boolean(selectedMatch?.selectedRunner && runner && selectedMatch.selectedRunner.runnerId === runner.runnerId);
  }

  function handleRunnerSelect(runner) {
    const selectedOdd = getOdds(runner);
    if (!selectedMatch || selectedOdd === "SUSPENDED" || selectedOdd === "-") return;

    onRunnerSelect({
      ...selectedMatch,
      selectedMarket: market,
      selectedRunner: runner,
      selectedOdd,
    });
  }

  useEffect(() => {
    if (!selectedMatch?.selectedRunner || selectedMatch.selectedMarket?.marketId !== market.marketId) return;
    const runner = runners.find((item) => item?.runnerId === selectedMatch.selectedRunner.runnerId);
    const selectedOdd = getOdds(runner);

    if (runner && selectedOdd !== selectedMatch.selectedOdd && selectedOdd !== "SUSPENDED" && selectedOdd !== "-") {
      onRunnerSelect({ ...selectedMatch, selectedMarket: market, selectedRunner: runner, selectedOdd });
    }
  }, [runners, selectedMatch, market, onRunnerSelect]);

  return (
    <div className="overflow-hidden rounded-md border border-live bg-live-primary shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-xs transition-colors duration-150 hover:bg-live-hover active:scale-[0.99]"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-2">
          <IoStarOutline className="h-3.5 w-3.5 shrink-0 text-live-accent" />
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-live-primary">{market.marketName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded bg-live-tertiary px-1.5 py-0.5 text-[10px] text-live-muted">{runners.length}</span>
          {isOpen ? <IoChevronUp className="h-4 w-4 text-live-muted" /> : <IoChevronDown className="h-4 w-4 text-live-muted" />}
        </div>
      </button>

      <div className={["grid transition-[grid-template-rows,opacity] duration-200 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"].join(" ")}>
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-live bg-live-tertiary px-2 py-2">
            {runners.length > 0 ? (
              <div className={["grid", gridClass, "gap-1.5"].join(" ")}>
                {runners.map((runner) => {
                  const oddsValue = getOdds(runner);
                  const highlighted = highlightedOdds[runner.runnerName] === oddsValue;
                  const selected = isSelectedRunner(runner);
                  const disabled = runner.status === "SUSPENDED" || oddsValue === "SUSPENDED" || oddsValue === "-";

                  return (
                    <button
                      type="button"
                      key={market.marketId + "-" + runner.runnerId}
                      className={[
                        "min-w-0 rounded bg-live-hover px-2 py-1.5 text-left transition-colors duration-150 active:scale-[0.98]",
                        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-live-odds",
                        selected ? "ring-1 ring-live-accent" : "",
                      ].join(" ")}
                      disabled={disabled}
                      onClick={() => handleRunnerSelect(runner)}
                    >
                      <div className={["flex", isOutright || runners.length > 3 ? "items-center justify-between gap-2" : "flex-col gap-1"].join(" ")}>
                        <span className={["truncate text-[11px] font-medium text-live-primary", isOutright || runners.length > 3 ? "flex-1" : "w-full text-center"].join(" ")}>{runner.runnerName}</span>
                        <span className={[
                          "inline-flex min-w-[48px] items-center justify-center rounded px-2 py-0.5 text-xs font-bold",
                          disabled ? "bg-live-danger text-white" : highlighted ? "odds-highlight text-live-primary" : "bg-live-odds text-live-accent",
                        ].join(" ")}>{oddsValue}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded bg-live-hover px-3 py-3 text-center text-xs text-live-muted">Markets currently unavailable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * MarketSection
 * - Dense responsive market grid for sportsbook-style market browsing.
 */
function MarketSection({ selectedMatch, onRunnerSelect, searchTerm = '', onSearchChange, onSearchClear }) {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedById, setExpandedById] = useState({});
  const [allMarketsExpanded, setAllMarketsExpanded] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [selectedMarketFilter, setSelectedMarketFilter] = useState('All');
  const [showEmptyState, setShowEmptyState] = useState(false); // Moved to top level
  const prevMarketsRef = useRef([]);
  const intervalRef = useRef(null);
  const [highlightedOdds, setHighlightedOdds] = useState({});
  const oddsHighlightTimerRef = useRef(null);
  const selectedRunnerRef = useRef(null);
  const prevSelectedMatchRef = useRef(null);
  const currentFetchControllerRef = useRef(null); // To cancel ongoing fetch requests

  // Store selected runner info
  useEffect(() => {
    if (selectedMatch && selectedMatch.selectedRunner) {
      selectedRunnerRef.current = {
        marketId: selectedMatch.selectedMarket?.marketId,
        runnerId: selectedMatch.selectedRunner?.runnerId,
        eventId: selectedMatch.eventId
      };
    }
  }, [selectedMatch]);

  // Clear interval and controller on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Cancel any ongoing fetch requests
      if (currentFetchControllerRef.current) {
        currentFetchControllerRef.current.abort();
      }
    };
  }, []);

  // Filter markets based on search term and market filter
  useEffect(() => {
    let result = markets;
    
    // Apply market filter
    if (selectedMarketFilter !== 'All') {
      result = result.filter(market => market.marketCategory === selectedMarketFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(market => 
        market.marketName?.toLowerCase().includes(term) ||
        market.runners?.some(runner => 
          runner.runnerName?.toLowerCase().includes(term)
        )
      );
    }
    
    setFilteredMarkets(result);
  }, [markets, searchTerm, selectedMarketFilter]);

  // Fetch markets data with polling optimization
  useEffect(() => {
    // Check if we're switching to a new match
    const isNewMatch = !prevSelectedMatchRef.current || 
                      (selectedMatch && prevSelectedMatchRef.current.eventId !== selectedMatch.eventId);
    
    // If switching to a new match, show loading state and clean up previous data
    if (isNewMatch && selectedMatch) {
      setLoading(true);
      setShowEmptyState(false); // Reset empty state when switching matches
      // Clear previous markets immediately when switching matches
      setMarkets([]);
      setFilteredMarkets([]);
      prevMarketsRef.current = [];
      // Reset expanded state for new match
      setExpandedById({});
      setAllMarketsExpanded(false);
      setSelectedMarketFilter('All');
      
      // Cancel any ongoing fetch requests for the previous match
      if (currentFetchControllerRef.current) {
        currentFetchControllerRef.current.abort();
      }
    }
    
    prevSelectedMatchRef.current = selectedMatch;

    // Check if we have all required data to fetch markets
    if (!selectedMatch || !selectedMatch.eventId) {
      setMarkets([]);
      setFilteredMarkets([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLoading(false);
      return;
    }

    const localMarkets = normaliseMarketsForDisplay(selectedMatch.markets);

    if (localMarkets.length > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const prevMarkets = prevMarketsRef.current;
      const newHighlightedOdds = {};

      localMarkets.forEach((market, marketIndex) => {
        const prevMarket = prevMarkets[marketIndex];

        if (prevMarket && market.runners) {
          market.runners.forEach((runner, runnerIndex) => {
            const prevRunner = prevMarket.runners?.[runnerIndex];

            if (prevRunner && runner.backPrices?.[0]?.price !== prevRunner.backPrices?.[0]?.price) {
              newHighlightedOdds[runner.runnerName] = runner.backPrices?.[0]?.price?.toFixed(2) || "-";
            }
          });
        }
      });

      if (Object.keys(newHighlightedOdds).length > 0) {
        if (oddsHighlightTimerRef.current) {
          clearTimeout(oddsHighlightTimerRef.current);
        }
        setHighlightedOdds(newHighlightedOdds);
        oddsHighlightTimerRef.current = setTimeout(() => {
          setHighlightedOdds({});
        }, 700);
      }

      setMarkets(localMarkets);
      prevMarketsRef.current = localMarkets;

      if (isNewMatch) {
        const initialExpanded = {};
        localMarkets.forEach((market, index) => {
          initialExpanded[market.marketId || index] = index < 8;
        });
        setExpandedById(initialExpanded);
        setAllMarketsExpanded(false);
      }

      setLoading(false);
      return;
    }

    // Markets are supplied by the odds-server event payload and updated via WebSocket.
    // Do not fall back to the legacy market service or browser polling here.
    setMarkets([]);
    setFilteredMarkets([]);
    setLoading(false);
  }, [selectedMatch]); // Include full selectedMatch for comprehensive updates

  const toggleMarket = (marketId) => {
    setExpandedById(prev => ({
      ...prev,
      [marketId]: !prev[marketId]
    }));
  };

  const toggleAllMarkets = () => {
    const newExpandedState = {};
    filteredMarkets.forEach((market, index) => {
      const marketId = market.marketId || index;
      newExpandedState[marketId] = !allMarketsExpanded;
    });
    setExpandedById(newExpandedState);
    setAllMarketsExpanded(!allMarketsExpanded);
  };

  // Handle market filter change
  const handleMarketFilter = (filter) => {
    setSelectedMarketFilter(filter);
  };

  // Split filtered markets into two columns
  const leftColumn = [];
  const rightColumn = [];
  
  filteredMarkets.forEach((market, idx) => {
    const marketId = market.marketId || idx;
    if (idx % 2 === 0) {
      leftColumn.push({ ...market, id: marketId });
    } else {
      rightColumn.push({ ...market, id: marketId });
    }
  });

  const marketTabs = MARKET_CATEGORY_TABS.map((tab) => ({
    ...tab,
    count: tab.id === "All"
      ? markets.length
      : markets.filter((market) => market.marketCategory === tab.id).length,
  })).filter((tab) => tab.id === "All" || tab.count > 0);
  
  // Manage empty state with delay to prevent flickering
  useEffect(() => {
    // Clear any existing timers
    let timer;
    
    if (filteredMarkets.length === 0 && !loading) {
      // Delay showing empty state by 300ms to prevent flickering
      timer = setTimeout(() => {
        // Double-check that we still have no markets and aren't loading
        if (filteredMarkets.length === 0 && !loading) {
          setShowEmptyState(true);
        }
      }, 300);
    } else {
      setShowEmptyState(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [filteredMarkets.length, loading]);
    
  // Render content based on state
  let content;
    
  if (loading) {
    content = (
      <div className="text-live-primary p-4 flex items-center justify-center h-full">
        <div className="flex flex-col items-center animate-pulse-scale">
          <div className="relative w-12 h-12">
            <div className="absolute w-full h-full rounded-full border-4 border-live-accent border-t-transparent animate-spin"></div>
            <div className="absolute w-8 h-8 top-2 left-2 rounded-full border-4 border-live-primary border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="mt-4 text-live-primary text-sm font-medium">Loading markets...</p>
        </div>
      </div>
    );
  } else if (showEmptyState) {
    content = (
      <div className="text-live-primary p-4 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-bold mb-2">Markets currently unavailable</div>
          <div className="text-sm text-live-muted">Odds will appear here as soon as this event has active markets.</div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col h-full">
        {/* Expand/Collapse All button - Modified to show "All Markets" only with theme-matching shadow */}
        <div className="px-2 pb-2 pt-3 cursor-pointer">
          <button
            onClick={toggleAllMarkets}
            className="w-full text-left px-3 py-2 text-xs bg-live-primary hover:bg-live-hover cursor-pointer rounded transition-colors duration-150 flex items-center justify-between border border-live"
          >
            <span className="text-live-primary font-medium">
              All Markets
            </span>
            <span className="text-live-accent text-xs">
              {filteredMarkets.length} markets
            </span>
          </button>
        </div>
  
        {/* Sleek Navbar with market names */}
        <div className="px-2 pb-2">
          <SleekNavbar
            onSearchChange={onSearchChange}
            searchValue={searchTerm}
            onSearchClear={onSearchClear}
            marketTabs={marketTabs}
            onMarketFilter={handleMarketFilter}
          />
        </div>
  
        {/* Dense responsive market grid */}
        <div className="flex-grow overflow-y-auto px-2 pb-2 custom-scrollbar">
          <div className="grid grid-cols-1 items-start gap-2">
            {filteredMarkets.map((market, idx) => {
              const marketId = market.marketId || idx;
              return (
                <MarketItem
                  key={marketId}
                  market={market}
                  isOpen={expandedById[marketId] ?? true}
                  onToggle={() => toggleMarket(marketId)}
                  highlightedOdds={highlightedOdds}
                  onRunnerSelect={onRunnerSelect}
                  selectedMatch={selectedMatch}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
    
  return content;
}

/**
 * SleekNavbar Component - Search bar with clear button
 */
function SleekNavbar({ onSearchChange, searchValue, onSearchClear, marketTabs = [], onMarketFilter }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!marketTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('All');
      onMarketFilter?.('All');
    }
  }, [marketTabs, activeTab, onMarketFilter]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      onSearchClear();
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onMarketFilter?.(tabId);
  };

  return (
    <div className="bg-live-tertiary rounded-md px-2 py-1.5 flex items-center gap-2 border border-live">
      {isSearchOpen ? (
        <>
          <button
            onClick={toggleSearch}
            className="text-live-primary hover:text-live-accent flex-shrink-0 mr-2 transition-colors duration-150"
          >
            <IoCloseOutline size={18} />
          </button>
          <div className="h-6 w-px bg-live-primary/60 mx-1"></div>
          <input
            type="text"
            placeholder="Search markets or runners..."
            className="flex-grow bg-transparent text-xs sm:text-sm text-live-primary placeholder:text-live-muted focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </>
      ) : (
        <div className="flex items-center w-full min-w-0">
          <button
            onClick={toggleSearch}
            className="text-live-primary hover:text-live-accent flex-shrink-0 mr-2 transition-colors duration-150"
          >
            <IoSearchOutline size={18} />
          </button>
          <div className="h-6 w-px bg-live-primary/60 mx-1"></div>
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar min-w-0">
            {marketTabs.map((tab) => (
              <button
                key={tab.id}
                className={[
                  "relative rounded px-2.5 py-1 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors duration-150",
                  activeTab === tab.id
                    ? "bg-live-accent text-live-dark"
                    : "text-live-muted hover:text-live-primary hover:bg-live-hover",
                ].join(" ")}
                onClick={() => handleTabClick(tab.id)}
              >
                <span>{tab.label}</span>
                <span className={[
                  "ml-1 text-[10px]",
                  activeTab === tab.id ? "text-live-dark" : "text-live-accent",
                ].join(" ")}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
