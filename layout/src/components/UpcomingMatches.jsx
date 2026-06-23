"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CalendarDays, ChevronRight, CircleDot, Clock, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { API_BASE } from "../utils/Constants"
import { ODDS_SPORT_KEY_BY_FRONTEND_KEY, SPORT_ID_BY_KEY, SPORTS } from "../utils/CommonExports"
import SkeletonLoader from "./ui/SkeletonLoader"
import { fetchSportsEvents } from "../utils/sportsEventsApi"
import { createOddsSocket } from "../utils/oddsWebSocket"

const PREFERRED_BOOKMAKER = "draftkings"

function getOddsKeyFromDelta(delta) {
  if (delta.outcome === delta.homeTeam) return "w1"
  if (delta.outcome === delta.awayTeam) return "w2"
  if (delta.outcome?.toLowerCase() === "draw") return "x"
  return null
}

function formatDateOrInPlay(status, openDateMs) {
  if (status === "IN_PLAY") return "IN PLAY"
  if (!openDateMs) return "-"
  const d = new Date(openDateMs)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(-2)
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${dd}.${mm}.${yy}, ${hh}:${min}`
}

// New function to format time for the game rows (HH:MM format)
function formatGameTime(openDateMs) {
  if (!openDateMs) return "-"
  const d = new Date(openDateMs)
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${min}`
}

// New function to format date for the game rows (DD.MM.YY format)
function formatGameDate(openDateMs) {
  if (!openDateMs) return "-"
  const d = new Date(openDateMs)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}.${mm}.${yy}`
}

// New function to check if a game falls within a specific time range
function isGameInTimeRange(openDateMs, timeRange) {
  if (!openDateMs) return false
  
  const now = new Date()
  const gameTime = new Date(openDateMs)
  const diffMinutes = (gameTime - now) / (1000 * 60) // Difference in minutes
  
  switch (timeRange) {
    case "0-15M":
      return diffMinutes >= 0 && diffMinutes <= 15
    case "15-30M":
      return diffMinutes > 15 && diffMinutes <= 30
    case "30-60M":
      return diffMinutes > 30 && diffMinutes <= 60
    default:
      return true
  }
}

function splitEventName(eventName = "") {
  const parts = eventName.split(/\s+vs\.?\s+/i)
  if (parts.length === 2) return { team1: parts[0], team2: parts[1] }
  return { team1: eventName, team2: "" }
}

function extractOddsW1W2(markets) {
  // Add safety checks for markets structure
  if (!markets || !markets.matchOdds || !Array.isArray(markets.matchOdds) || markets.matchOdds.length === 0) {
    return { w1: "-", w2: "-" };
  }
  
  const mo = markets.matchOdds[0];
  if (!mo || !mo.runners || !Array.isArray(mo.runners) || mo.runners.length < 2) {
    return { w1: "-", w2: "-" };
  }
  
  const r0 = mo.runners[0];
  const r1 = mo.runners[1];
  const w1 = r0?.backPrices?.[0]?.price;
  const w2 = r1?.backPrices?.[0]?.price;
  return {
    w1: typeof w1 === "number" ? w1.toString() : "-",
    w2: typeof w2 === "number" ? w2.toString() : "-",
  };
}

function normalize(str = "") {
  return str.trim().toLowerCase()
}

function findSportKeyByName(sportName) {
  if (!sportName) return null
  const n = normalize(sportName)
  for (const s of SPORTS) {
    for (const alias of s.sportNames) {
      if (normalize(alias) === n) return s.key
    }
  }
  return null
}

export default function UpcomingMatches() {
  const navigate = useNavigate()
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(null)
  const [selectedSportKey, setSelectedSportKey] = useState("soccer")
  const [selectedGameId, setSelectedGameId] = useState(null)
  const [selectedGameSportKey, setSelectedGameSportKey] = useState(null)
  const [events, setEvents] = useState([])
  const [oddsByEventId, setOddsByEventId] = useState({})
  const [highlightedOdds, setHighlightedOdds] = useState({})
  const oddsPrevRef = useRef({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const featuredGame = null
  const timeFilters = ["0-15M", "15-30M", "30-60M"]

  // Initial load: fetch static match info
  useEffect(() => {
    const controller = new AbortController()
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const sportId = selectedSportKey ? SPORT_ID_BY_KEY[selectedSportKey] : undefined
        const data = sportId ? await fetchSportsEvents(sportId, false) : { sports: [] };

        // Check if we received valid data
        if (!data || !Array.isArray(data.sports)) {
          throw new Error("Invalid data format received from API");
        }
        
        const list = data.sports;
        setEvents(list)
        // Set initial odds
        const oddsMap = {}
        for (const e of list) {
          oddsMap[e.eventId] = extractOddsW1W2(e.markets)
        }
        setOddsByEventId(oddsMap)
        oddsPrevRef.current = oddsMap
        setHighlightedOdds({})
      } catch (e) {
        if (e?.name !== "AbortError") {
          const errorMessage = e?.message || "Failed to load events";
          setError(`Error loading events: ${errorMessage}`);
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
    return () => controller.abort()
  }, [selectedSportKey])

  // WebSocket: update odds without frontend HTTP polling.
  useEffect(() => {
    const visibleLeagueKeys = events.map((event) => event.sportKey).filter(Boolean);
    const fallbackLeagueKey = ODDS_SPORT_KEY_BY_FRONTEND_KEY[selectedSportKey];
    const sportKeys = [...new Set(visibleLeagueKeys.length > 0 ? visibleLeagueKeys : [fallbackLeagueKey].filter(Boolean))];

    if (sportKeys.length === 0) {
      return;
    }

    const socket = createOddsSocket({
      sportKeys,
      onOddsUpdate: (message) => {
        const nextOddsByEventId = { ...oddsPrevRef.current }
        const nextHighlights = {}
        let hasUpdates = false

        for (const delta of message.deltas || []) {
          if (delta.market !== "h2h" || delta.bookmaker !== PREFERRED_BOOKMAKER) {
            continue
          }

          const oddsKey = getOddsKeyFromDelta(delta)

          if (!oddsKey) {
            continue
          }

          const previousEventOdds = nextOddsByEventId[delta.eventId] || {}
          nextOddsByEventId[delta.eventId] = {
            ...previousEventOdds,
            [oddsKey]: Number(delta.price).toFixed(2),
          }
          nextHighlights[delta.eventId] = {
            ...(nextHighlights[delta.eventId] || {}),
            [oddsKey]: true,
          }
          hasUpdates = true
        }

        if (!hasUpdates) {
          return
        }

        setOddsByEventId(nextOddsByEventId)
        setHighlightedOdds((previous) => ({
          ...previous,
          ...nextHighlights,
        }))
        oddsPrevRef.current = nextOddsByEventId

        setTimeout(() => {
          setHighlightedOdds({})
        }, 1000)
      }
    })
    
    return () => {
      socket.close()
    }
  }, [events, selectedSportKey])

  const filteredEvents = useMemo(() => {
    return events
  }, [events])

  const matches = useMemo(() => {
    // First filter by sport
    const sportFilteredMatches = filteredEvents.map((e, idx) => {
      const { team1, team2 } = splitEventName(e.eventName)
      const odds = oddsByEventId[e.eventId] || extractOddsW1W2(e.markets)
      const inferredSportKey = e.sportKey || findSportKeyByName(e.sportName) || null
      return {
        id: e.eventId || idx,
        openDate: e.openDate,
        status: e.status,
        timeLabel: formatDateOrInPlay(e.status, e.openDate),
        gameTime: formatGameTime(e.openDate), // New formatted time for game rows
        gameDate: formatGameDate(e.openDate), // New formatted date for game rows
        team1,
        team2,
        isFavorite: !!e.isFavourite,
        odds,
        additionalMarkets: "",
        sportKey: inferredSportKey,
        highlight: highlightedOdds[e.eventId] || { w1: false, w2: false },
        competitionName: e.competitionName || "", // Add competition name from API
        catName: e.catName || "" // Add category name from API
      }
    })
    
    // Only apply time filtering if a time filter is selected
    if (selectedTimeFilter) {
      return sportFilteredMatches.filter(match => 
        isGameInTimeRange(match.openDate, selectedTimeFilter)
      )
    }
    
    // If no time filter is selected, show all matches
    return sportFilteredMatches
  }, [filteredEvents, oddsByEventId, highlightedOdds, selectedTimeFilter])

  const matchesByDate = useMemo(() => {
    return matches.reduce((groups, match) => {
      const dateKey = match.gameDate || "Date to be confirmed";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
      return groups;
    }, {});
  }, [matches]);
  const handleGameClick = (id, sportKey) => {
    console.log('=== UPCOMING MATCHES NAVIGATION START ===');
    console.log('Clicked game ID:', id);
    console.log('Clicked sport key:', sportKey);
    
    setSelectedGameId(id)
    setSelectedGameSportKey(sportKey || null)
    
    // Find the full event object to pass detailed data
    const clickedMatch = matches.find(m => m.id === id);
    console.log('Found clicked match:', clickedMatch);
    
    const viewType = 'prematch'; 

    // Navigate to the Live section with the selected game and sport
    const navigationState = {
      selectedGameId: id,
      selectedSportKey: sportKey || selectedSportKey,
      viewType: viewType,
      source: 'upcoming_matches',
      // Pass full match details to avoid refetching/delay
      matchDetails: clickedMatch ? {
        eventName: clickedMatch.team1 + " vs " + clickedMatch.team2,
        team1: clickedMatch.team1,
        team2: clickedMatch.team2,
        openDate: clickedMatch.openDate,
        status: clickedMatch.status,
        sportKey: clickedMatch.sportKey
      } : null
    };
    
    console.log('Navigating with state:', navigationState);
    navigate('/live_events/event-view', {
      state: navigationState
    })
  }

  return (
    <section className="overflow-hidden border border-live bg-live-primary text-live-primary">
      <header className="border-b border-live bg-live-secondary px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center border border-live-accent/60 bg-live-tertiary text-live-accent">
                <CalendarDays className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base">Upcoming matches</h2>
            </div>
            <p className="mt-1 text-xs text-live-muted">
              {matches.length} {matches.length === 1 ? "event" : "events"} available in {SPORTS.find((sport) => sport.key === selectedSportKey)?.sportNames?.[0] || "selected sport"}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="hidden text-[11px] font-semibold uppercase tracking-wide text-live-muted sm:inline">Kick-off</span>
            {[...timeFilters, "All"].map((filter) => {
              const isActive = filter === "All" ? !selectedTimeFilter : selectedTimeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedTimeFilter(filter === "All" ? null : filter)}
                  className={`h-8 shrink-0 border px-3 text-xs font-semibold transition-colors duration-150 active:scale-[0.97] ${
                    isActive
                      ? "border-live-accent bg-live-accent text-live-dark"
                      : "border-live bg-live-primary text-live-muted hover:border-live-accent/70 hover:text-live-primary"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="border-b border-live bg-live-primary px-2 py-2 sm:px-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SPORTS.map((sport) => {
            const Icon = sport.icon;
            const isSelected = selectedSportKey === sport.key;

            return (
              <button
                key={sport.key}
                type="button"
                onClick={() => setSelectedSportKey(sport.key)}
                title={sport.sportNames[0]}
                className={`flex h-10 shrink-0 items-center gap-2 border px-3 text-xs font-semibold transition-colors duration-150 active:scale-[0.97] ${
                  isSelected
                    ? "border-live-accent bg-live-tertiary text-live-primary shadow-[inset_0_-2px_0_#ffc400]"
                    : "border-live bg-live-secondary text-live-muted hover:border-live-accent/60 hover:text-live-primary"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-live-accent" : "text-live-muted"}`} />
                <span>{sport.sportNames[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_72px_66px_66px] items-center gap-2 border-b border-live bg-live-hover px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-live-muted sm:grid-cols-[minmax(0,1fr)_84px_76px_76px] sm:px-4">
        <span>Event</span>
        <span className="text-center">Time</span>
        <span className="text-center">1</span>
        <span className="text-center">2</span>
      </div>

      {loading && (
        <div className="px-3 py-3">
          <SkeletonLoader type="row" count={5} />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 px-4 py-8 text-sm text-red-400">
          <CircleDot className="h-4 w-4" />
          {error}
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="flex min-h-44 flex-col items-center justify-center px-4 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center border border-live bg-live-secondary text-live-muted">
            <Search className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold text-live-primary">No matches available</p>
          <p className="mt-1 text-xs text-live-muted">
            {selectedTimeFilter ? `No events start within ${selectedTimeFilter.toLowerCase()}.` : "Choose another sport to view its events."}
          </p>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="max-h-[430px] overflow-y-auto custom-scrollbar">
          {Object.entries(matchesByDate).map(([dateLabel, dateMatches]) => (
            <div key={dateLabel} className="border-b border-live last:border-b-0">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-live/70 bg-live-primary px-3 py-2 shadow-sm sm:px-4">
                <span className="text-xs font-bold text-live-accent">{dateLabel}</span>
                <span className="rounded bg-live-tertiary px-2 py-0.5 text-[10px] font-semibold text-live-muted">{dateMatches.length}</span>
              </div>

              {dateMatches.map((match) => {
                const isSelected = selectedGameId === match.id;
                const isLive = match.status === "IN_PLAY";

                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => handleGameClick(match.id, match.sportKey)}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_72px_66px_66px] items-center gap-2 border-b border-live/70 px-3 py-3 text-left transition-colors duration-150 last:border-b-0 active:scale-[0.995] sm:grid-cols-[minmax(0,1fr)_84px_76px_76px] sm:px-4 ${
                      isSelected
                        ? "bg-live-odds/45 shadow-[inset_3px_0_0_#ffc400]"
                        : "bg-live-secondary hover:bg-live-hover"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        {isLive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />}
                        <span className="truncate text-sm font-semibold text-live-primary">{match.team1}</span>
                      </div>
                      <div className="mt-0.5 flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs text-live-muted">{match.team2}</span>
                        {isLive && <span className="shrink-0 text-[9px] font-bold tracking-wide text-red-400">LIVE</span>}
                      </div>
                      <div className="mt-1 truncate text-[10px] text-live-muted">{match.competitionName || "Match odds"}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-semibold text-live-primary">{match.gameTime}</div>
                      <div className="mt-0.5 text-[10px] text-live-muted">{isLive ? "In play" : "Kick-off"}</div>
                    </div>

                    {[
                      { key: "w1", value: match.odds.w1 },
                      { key: "w2", value: match.odds.w2 },
                    ].map((odd) => (
                      <span
                        key={odd.key}
                        className={`flex h-9 items-center justify-center border text-xs font-bold transition-colors duration-150 ${
                          match.highlight?.[odd.key]
                            ? "odds-highlight text-live-primary"
                            : "border-live bg-live-primary text-live-accent"
                        }`}
                      >
                        {odd.value}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-end border-t border-live bg-live-secondary px-3 py-2 sm:px-4">
        <button type="button" className="flex items-center gap-1 text-xs font-semibold text-live-muted transition-colors duration-150 hover:text-live-accent active:scale-[0.97]">
          View all markets
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </footer>
    </section>
  )
}
