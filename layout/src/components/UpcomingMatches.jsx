"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock, ChevronRight } from "lucide-react"


import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { API_BASE } from "../utils/Constants"
import { SPORT_ID_BY_KEY, SPORTS } from "../utils/CommonExports"

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

function splitEventName(eventName = "") {
  const parts = eventName.split(/\s+vs\.?\s+/i)
  if (parts.length === 2) return { team1: parts[0], team2: parts[1] }
  return { team1: eventName, team2: "" }
}

function extractOddsW1W2(markets) {
  const mo = markets?.matchOdds?.[0]
  const r0 = mo?.runners?.[0]
  const r1 = mo?.runners?.[1]
  const w1 = r0?.backPrices?.[0]?.price
  const w2 = r1?.backPrices?.[0]?.price
  return {
    w1: typeof w1 === "number" ? w1.toString() : "-",
    w2: typeof w2 === "number" ? w2.toString() : "-",
  }
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

export default function Component() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("0-15M")
  const [selectedSportKey, setSelectedSportKey] = useState("soccer")
  
  const [selectedGameId, setSelectedGameId] = useState(null)
  const [selectedGameSportKey, setSelectedGameSportKey] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const featuredGame = null
  const timeFilters = ["0-15M", "15-30M", "30-60M"]

  useEffect(() => {
    const controller = new AbortController()
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const sportId = selectedSportKey ? SPORT_ID_BY_KEY[selectedSportKey] : undefined
        const url = sportId ? `${API_BASE}sport_id=${sportId}&live_matches=true` : API_BASE

        const res = await fetch(url, {
          headers: { accept: "application/json" },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const list = json?.data?.sports ?? []
        setEvents(Array.isArray(list) ? list : [])
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message || "Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
    return () => controller.abort()
  }, [selectedSportKey])

  const filteredEvents = useMemo(() => {
    if (!selectedSportKey) return events
    const sportConf = SPORTS.find((s) => s.key === selectedSportKey)
    if (!sportConf) return events
    const allowed = new Set(sportConf.sportNames.map(normalize))
    return events.filter((e) => allowed.has(normalize(e.sportName)))
  }, [events, selectedSportKey])

  const matches = useMemo(() => {
    return filteredEvents.map((e, idx) => {
      const { team1, team2 } = splitEventName(e.eventName)
      const odds = extractOddsW1W2(e.markets)
      // try to have a sportKey even if API lacks it (fallback by sportName)
      const inferredSportKey = e.sportKey || findSportKeyByName(e.sportName) || null
      return {
        id: e.eventId || idx,
        openDate: e.openDate,
        status: e.status,
        timeLabel: formatDateOrInPlay(e.status, e.openDate),
        team1,
        team2,
        isFavorite: !!e.isFavourite,
        odds,
        additionalMarkets: "",
        sportKey: inferredSportKey,
      }
    })
  }, [filteredEvents])

  const handleGameClick = (id, sportKey) => {
    setSelectedGameId(id)
    setSelectedGameSportKey(sportKey || null)
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
          <div className="text-sm text-muted-foreground text-center py-6">No featured game available</div>
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
        {SPORTS.map((sport) => {
          const Icon = sport.icon
          const isSelected = selectedSportKey === sport.key
          return (
            <div
              key={sport.key}
              onClick={() => setSelectedSportKey(sport.key)}
              className={`snap-start flex-shrink-0 sm:flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer border border-gray-600 rounded-md transition-transform duration-200 ease-in-out hover:scale-105 text-white ${
                isSelected ? "ring-2 ring-white" : ""
              }`}
              // mobile min width to keep chips touch-friendly, but allow grow from sm+
              style={{ padding: "0.45rem 0.7rem", minWidth: "64px" }}
              title={sport.sportNames[0]}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mx-auto" />
              <span className="text-[11px] sm:text-[13px] truncate max-w-[90%] text-center">
                {sport.sportNames[0]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Winner dropdown and W1/W2 header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 lg:px-5 py-2 bg-[#3f3e3e] gap-3">
        <div>
          <Select defaultValue="winner">
            <SelectTrigger className="w-28 sm:w-32 bg-gray-800 border-gray-600 text-white text-xs sm:text-sm flex items-center justify-between">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="winner" className="text-white text-xs sm:text-sm">
                Winner
              </SelectItem>
              <SelectItem value="handicap" className="text-white text-xs sm:text-sm">
                Handicap
              </SelectItem>
              <SelectItem value="over-under" className="text-white text-xs sm:text-sm">
                Total
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-medium cursor-pointer">
          <div className="w-10 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center rounded">W1</div>
          <div className="w-10 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center rounded">W2</div>
        </div>
      </div>

      {/* Loading / Error / Empty states */}
      {loading && <div className="px-4 py-3 text-sm text-muted-foreground">Loading live events…</div>}
      {error && <div className="px-4 py-3 text-sm text-red-400">Error: {error}</div>}
      {!loading && !error && matches.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">Currently no matches to display</div>
      )}

      {/* Matches list */}
      <div className="flex flex-col px-2">
        {!loading &&
          matches.map((match) => {
            const isSelected = selectedGameId === match.id
            // apply color only to the clicked game; prefer selectedGameSportKey when set
            const effectiveSportKey = selectedGameSportKey || match.sportKey
            const sportColor = isSelected ? SPORTS.find((s) => s.key === effectiveSportKey)?.color || "" : ""
            return (
              <div
                key={match.id}
                onClick={() => handleGameClick(match.id, match.sportKey)}
                className={`cursor-pointer flex items-center justify-between gap-3 px-3 py-2 m-1 rounded-md transition-all ${
                  isSelected ? `${sportColor} text-white shadow-md` : "bg-[#505050] hover:bg-[#606060]"
                }`}
              >
                {/* Left: time + teams */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="whitespace-nowrap text-[11px]">{match.timeLabel}</span>
                  </div>

                  <div className="h-5 w-px bg-gradient-to-b from-transparent via-muted-foreground to-transparent opacity-30 hidden sm:block" />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-[13px] sm:text-sm">
                      {match.team1}
                    </div>
                    <div className="text-[12px] sm:text-sm truncate opacity-90">
                      {match.team2}
                    </div>
                  </div>

                  <div className="text-muted-foreground text-[11px] self-start sm:self-center truncate ml-2 hidden md:block">
                    {match.additionalMarkets}
                  </div>
                </div>

                {/* Right: odds buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-10 sm:w-16 h-8 px-0 text-[11px] ${isSelected ? "bg-white text-black" : ""}`}
                  >
                    {match.odds.w1}
                  </Button>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-10 sm:w-16 h-8 px-0 text-[11px] ${isSelected ? "bg-white text-black" : ""}`}
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
