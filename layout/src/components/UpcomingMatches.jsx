"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Clock, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { API_BASE } from "../utils/Constants"
import { SPORT_ID_BY_KEY, SPORTS } from "../utils/CommonExports"
import SkeletonLoader from "./ui/SkeletonLoader"
import { fetchSportsEvents } from "../utils/sportsEventsApi"

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
        // Use the fetchSportsEvents function which now directly uses the backup endpoint
        const data = sportId ? await fetchSportsEvents(sportId, true) : { sports: [] };
        console.log("Fetched data:", data); // Debug log
        
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
        console.error("Error in fetchEvents:", e); // Debug log
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

  // Polling: update only odds every second, highlight changes
  useEffect(() => {
    let intervalId
    async function pollOdds() {
      try {
        const sportId = selectedSportKey ? SPORT_ID_BY_KEY[selectedSportKey] : undefined
        // Use the fetchSportsEvents function which now directly uses the backup endpoint
        const data = sportId ? await fetchSportsEvents(sportId, true) : { sports: [] };
  
        // Check if we received valid data before processing
        if (!data || !Array.isArray(data.sports)) {
          console.warn(`Invalid data received for sport ${selectedSportKey}, skipping update`);
          return;
        }
        
        const list = data.sports;
        const oddsMap = { ...oddsByEventId }
        const highlights = {}
        for (const e of list) {
          const newOdds = extractOddsW1W2(e.markets)
          const prevOdds = oddsPrevRef.current[e.eventId] || {}
          oddsMap[e.eventId] = newOdds
          highlights[e.eventId] = {
            w1: prevOdds.w1 !== newOdds.w1,
            w2: prevOdds.w2 !== newOdds.w2,
          }
        }
        setOddsByEventId(oddsMap)
        setHighlightedOdds(highlights)
        oddsPrevRef.current = oddsMap
        // Remove highlight after 1s
        setTimeout(() => {
          setHighlightedOdds({})
        }, 1000)
      } catch (error) {
        console.error("Error polling odds:", error);
        // Don't stop polling on error, just log it
      }
    }
    
    // Add error handling for the interval setup
    try {
      intervalId = setInterval(() => {
        try {
          pollOdds();
        } catch (error) {
          console.error("Error in pollOdds interval:", error);
        }
      }, 1000)
    } catch (error) {
      console.error("Error setting up polling interval:", error);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [selectedSportKey, oddsByEventId])

  const filteredEvents = useMemo(() => {
    if (!selectedSportKey) return events
    const sportConf = SPORTS.find((s) => s.key === selectedSportKey)
    if (!sportConf) return events
    const allowed = new Set(sportConf.sportNames.map(normalize))
    return events.filter((e) => allowed.has(normalize(e.sportName)))
  }, [events, selectedSportKey])

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

  const handleGameClick = (id, sportKey) => {
    setSelectedGameId(id)
    setSelectedGameSportKey(sportKey || null)
    
    // Navigate to the Live section with the selected game and sport
    navigate('/live_events/event-view', {
      state: {
        selectedGameId: id,
        selectedSportKey: sportKey || selectedSportKey
      }
    })
  }

  return (
    <div className="bg-[#3f3e3e] text-white">
      {/* Featured Game */}
      <div className="p-3 sm:p-4">
        <h2 className="text-sm sm:text-lg font-semibold mb-3">FEATURED GAME</h2>
        {featuredGame ? (
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-md cursor-pointer border border-gray-600 transition-all duration-200 ease-in-out ${
              selectedGameId === featuredGame.id ? `${featuredGame.color} text-white` : ""
            }`}
            onClick={() => handleGameClick(featuredGame.id, featuredGame.sportKey)}
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] sm:text-sm text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{featuredGame.date}</span>
              </div>
              <div className="font-medium text-[13px] sm:text-base truncate">
                {featuredGame.team1} vs {featuredGame.team2}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedGameId === featuredGame.id ? "default" : "outline"}
                size="sm"
                className={`w-10 sm:w-16 px-0 ${selectedGameId === featuredGame.id ? "bg-white text-black" : ""}`}
              >
                {featuredGame.odds.w1}
              </Button>
              <Button
                variant={selectedGameId === featuredGame.id ? "default" : "outline"}
                size="sm"
                className={`w-10 sm:w-16 px-0 ${selectedGameId === featuredGame.id ? "bg-white text-black" : ""}`}
              >
                {featuredGame.odds.w2}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">There is no featured games at the moment</div>
        )}
      </div>

      {/* Upcoming Matches Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3">
        <h2 className="text-sm sm:text-lg font-semibold">UPCOMING MATCHES</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {timeFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedTimeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeFilter(filter)}
                className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 ${
                  selectedTimeFilter === filter
                    ? "bg-white text-black hover:bg-white"
                    : "bg-transparent border-gray-600 text-white hover:bg-white hover:text-black"
                }`}
              >
                {filter}
              </Button>
            ))}
            {/* Add a "Show All" button to reset the time filter */}
            <Button
              variant={!selectedTimeFilter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeFilter(null)}
              className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 ${
                !selectedTimeFilter
                  ? "bg-white text-black hover:bg-white"
                  : "bg-transparent border-gray-600 text-white hover:bg-white hover:text-black"
              }`}
            >
              All
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 hover:text-white text-xs sm:text-sm">
            More
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Sports Icons bar */}
      {/* Mobile: fixed small chips scrollable; sm+: chips expand evenly */}
      <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide px-2 py-2">
        {loading ? (
          SPORTS.map((sport) => {
            const Icon = sport.icon
            const isSelected = selectedSportKey === sport.key
            // Extract background color class from sport.color
            const colorClass = sport.color.split(' ').find(cls => cls.startsWith('bg-chart-')) || 'bg-gray-600'
            return (
              <div
                key={sport.key}
                onClick={() => setSelectedSportKey(sport.key)}
                className={`snap-start flex-shrink-0 sm:flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border rounded-md sport-icon-box ${
                  isSelected 
                  ? `${colorClass} selected border-white` 
                  : "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                }`}
                // mobile min width to keep chips touch-friendly, but allow grow from sm+
                style={{ padding: "0.45rem 0.7rem", minWidth: "64px" }}
                title={sport.sportNames[0]}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mx-auto" />
                <span className="text-[11px] sm:text-[13px] truncate max-w-[90%] text-center font-medium">
                  {sport.sportNames[0]}
                </span>
              </div>
            )
          })
        ) : (
          SPORTS.map((sport) => {
            const Icon = sport.icon
            const isSelected = selectedSportKey === sport.key
            // Extract background color class from sport.color
            const colorClass = sport.color.split(' ').find(cls => cls.startsWith('bg-chart-')) || 'bg-gray-600'
            return (
              <div
                key={sport.key}
                onClick={() => setSelectedSportKey(sport.key)}
                className={`snap-start flex-shrink-0 sm:flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border rounded-md sport-icon-box ${
                  isSelected 
                  ? `${colorClass} selected border-white` 
                  : "border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
                }`}
                // mobile min width to keep chips touch-friendly, but allow grow from sm+
                style={{ padding: "0.45rem 0.7rem", minWidth: "64px" }}
                title={sport.sportNames[0]}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mx-auto" />
                <span className="text-[11px] sm:text-[13px] truncate max-w-[90%] text-center font-medium">
                  {sport.sportNames[0]}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* W1/W2 header above the matches list */}
      <div className="flex justify-end px-3 lg:px-5 py-2">
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
          <div className="w-10 sm:w-16 bg-[#505050] flex items-center justify-center h-6 sm:h-8 text-center rounded">W1</div>
          <div className="w-10 sm:w-16 bg-[#505050] flex items-center justify-center h-6 sm:h-8 text-center rounded">W2</div>
        </div>
      </div>

      {/* Loading / Error / Empty states */}
      {loading && (
        <div className="flex flex-col px-2">
          {/* Using SkeletonLoader for match rows when loading */}
          <SkeletonLoader type="row" count={5} />
        </div>
      )}
      {error && <div className="px-4 py-3 text-sm text-red-400">Error: {error}</div>}
      {!loading && !error && matches.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
          Currently no matches to display
          {selectedTimeFilter && ` for ${selectedTimeFilter} time range`}
        </div>
      )}

      {/* Matches list with scroll for more than 5 items */}
      <div className="flex flex-col px-2 max-h-[320px] overflow-y-auto custom-scrollbar">
        {!loading &&
          matches.map((match) => {
            const isSelected = selectedGameId === match.id
            
            // Determine the background styling based on selection state
            let backgroundClass = "bg-[#505050] hover:bg-[#606060]"
            let textColor = "text-white"
            
            // Only apply sport color when this specific game is clicked
            if (isSelected) {
              // Use selectedSportKey if available, otherwise fall back to match's sport key
              const effectiveSportKey = selectedSportKey || match.sportKey
              const sportConfig = SPORTS.find((s) => s.key === effectiveSportKey)
              
              if (sportConfig) {
                // Apply the full sport color background
                backgroundClass = sportConfig.color.split(' ').find(cls => cls.startsWith('bg-chart-')) || "bg-gray-600"
                // Adjust text color based on background - lighter backgrounds need dark text
                textColor = sportConfig.color.includes('bg-chart-4') || sportConfig.color.includes('bg-chart-13') 
                  ? "text-black" : "text-white"
              }
            }
            
            return (
              <div
                key={match.id}
                onClick={() => handleGameClick(match.id, match.sportKey)}
                className={`cursor-pointer flex items-center justify-between gap-3 px-3 py-2 m-1 rounded-md transition-all duration-300 ${
                  backgroundClass
                } ${textColor} ${isSelected ? 'shadow-md transform scale-[1.01] border border-white/20' : ''}`}
              >
                {/* Left: date + time */}
                <div className="flex flex-col items-start gap-1 text-[11px] text-muted-foreground flex-shrink-0 w-16">
                  <div className="whitespace-nowrap">{match.gameDate}</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap">{match.gameTime}</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-gradient-to-b from-transparent via-muted-foreground to-transparent opacity-30" />

                {/* Center: teams + IN PLAY + competition name + LIVE */}
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <div className="font-medium truncate text-[13px] sm:text-sm">
                      {match.team1}
                    </div>
                    <div className="text-[12px] sm:text-sm truncate opacity-90">
                      {match.team2}
                    </div>
                    {match.status === "IN_PLAY" && (
                      <div className="text-[9px] font-bold bg-red-600 text-white px-1 py-0.5 rounded w-fit mt-1">
                        IN PLAY
                      </div>
                    )}
                  </div>
                  
                  {/* Competition name and LIVE in a single line */}
                  <div className="flex items-center gap-2 mx-2">
                    {match.competitionName && (
                      <div className="text-[11px] text-white truncate"> {/* Changed to text-white for better visibility */}
                        {match.competitionName}
                      </div>
                    )}
                    {match.catName && (
                      <div className="text-[10px] bg-blue-700 px-1.5 py-0.5 rounded">
                        {match.catName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-muted-foreground text-[11px] self-start sm:self-center truncate ml-2 hidden md:block">
                  {match.additionalMarkets}
                </div>

                {/* Right: odds buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-10 sm:w-16 h-8 px-0 text-[11px] font-semibold ${
                      isSelected 
                        ? "bg-white text-black hover:bg-gray-100 border-white shadow-sm" 
                        : "bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
                    } ${match.highlight.w1 ? "odds-highlight" : ""}`}
                  >
                    {match.odds.w1}
                  </Button>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-10 sm:w-16 h-8 px-0 text-[11px] font-semibold ${
                      isSelected 
                        ? "bg-white text-black hover:bg-gray-100 border-white shadow-sm" 
                        : "bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
                    } ${match.highlight.w2 ? "odds-highlight" : ""}`}
                  >
                    {match.odds.w2}
                  </Button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}