"use client"

import { useState } from "react"
import {
  Clock,
  Star,
  ChevronRight,
} from "lucide-react"
import { MdSportsCricket } from "react-icons/md"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { IoMdFootball } from "react-icons/io"
import { FaTableTennis, FaVolleyballBall } from "react-icons/fa"
import { CiBasketball } from "react-icons/ci"

export default function Component() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("0-15M")
  const [selectedSport, setSelectedSport] = useState(null)
  const [selectedGameId, setSelectedGameId] = useState(null)

  const matches = [
    {
      id: 1,
      date: "22.07.25, 14:30",
      team1: "Pohang Steelers",
      team2: "Suwon FC",
      additionalMarkets: "+373",
      odds: { w1: "1.90", x: "3.40", w2: "3.59" },
      isFavorite: false,
    },
    {
      id: 2,
      date: "22.07.25, 14:30",
      team1: "Gwangju FC",
      team2: "Gimcheon Sangmu FC",
      additionalMarkets: "+383",
      odds: { w1: "2.32", x: "3.17", w2: "2.84" },
      isFavorite: true,
    },
    {
      id: 3,
      date: "22.07.25, 14:30",
      team1: "FC Anyang",
      team2: "Daegu FC",
      additionalMarkets: "+375",
      odds: { w1: "2.11", x: "3.34", w2: "3.07" },
      isFavorite: true,
    },
    {
      id: 4,
      date: "22.07.25, 14:30",
      team1: "Celta de Vigo",
      team2: "CD Nacional Madeira",
      additionalMarkets: "+225",
      odds: { w1: "1.41", x: "4.50", w2: "5.90" },
      isFavorite: true,
    },
  ]

  const featuredGame = null
  // Uncomment below to test featured game
  // const featuredGame = {
  //   id: 99,
  //   date: "22.07.25, 20:00",
  //   team1: "Featured Team 1",
  //   team2: "Featured Team 2",
  //   odds: { w1: "1.50", x: "3.00", w2: "5.00" },
  // }

  const timeFilters = ["0-15M", "15-30M", "30-60M"]

  const sports = [
    { id: "football", icon: IoMdFootball, color: "text-chart-5 bg-chart-5" },
    { id: "baseball", icon: MdSportsCricket, color: "text-chart-1 bg-chart-1" },
    { id: "basketball", icon: CiBasketball, color: "text-chart-2 bg-chart-2" },
    { id: "tennis", icon: FaTableTennis, color: "text-chart-3 bg-chart-3" },
    { id: "volleyball", icon: FaVolleyballBall, color: "text-chart-4 bg-chart-4" },
  ]

  // Handler for selecting a game (changes background and icon colors)
  const handleGameClick = (id) => {
    setSelectedGameId(id)
  }

  return (
    <div className="bg-[#3f3e3e] text-white">

      {/* Featured Game Section */}
      <div className=" p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold mb-3">FEATURED GAME</h2>

        {featuredGame ? (
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-md
            ${selectedGameId === featuredGame.id ? featuredGame.color + " text-white" : ""}
            cursor-pointer
            border border-gray-600
            transition-all duration-200 ease-in-out
             
            `}
            onClick={() => handleGameClick(featuredGame.id)}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{featuredGame.date}</span>
              </div>
              <div className="font-medium text-sm sm:text-base">
                {featuredGame.team1} vs {featuredGame.team2}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedGameId === featuredGame.id ? "default" : "outline"}
                size="sm"
                className={`w-12 px-0 ${selectedGameId === featuredGame.id ? "bg-white text-black" : ""}`}
              >
                {featuredGame.odds.w1}
              </Button>
              <Button
                variant={selectedGameId === featuredGame.id ? "default" : "outline"}
                size="sm"
                className={`w-12 px-0 ${selectedGameId === featuredGame.id ? "bg-white text-black" : ""}`}
              >
                {featuredGame.odds.x}
              </Button>
              <Button
                variant={selectedGameId === featuredGame.id ? "default" : "outline"}
                size="sm"
                className={`w-12 px-0 ${selectedGameId === featuredGame.id ? "bg-white text-black" : ""}`}
              >
                {featuredGame.odds.w2}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No featured game available
          </div>
        )}
      </div>

      {/* Upcoming Matches Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0">
        <h1 className="text-base sm:text-lg font-semibold">UPCOMING MATCHES</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Time filters */}
          <div className="flex gap-1 flex-wrap">
            {timeFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedTimeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeFilter(filter)}
                className={`text-xs px-2 py-1 sm:px-3 sm:py-2 ${selectedTimeFilter === filter
                  ? "bg-white text-black hover:bg-white"
                  : "bg-transparent border-gray-600 text-white hover:bg-white hover:text-black"
                  }`}
              >
                {filter}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 hover:text-white text-xs sm:text-sm"
          >
            More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Sports Icons with border and hover pop-out, cursor pointer */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        {sports.map((sport) => {
          const Icon = sport.icon
          const isSelected = selectedSport === sport.id
          return (
            <div
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`cursor-pointer border border-gray-600 rounded-md p-2 transition-transform duration-200 ease-in-out transform hover:scale-105
                ${isSelected ? `${sport.color} text-white` : "text-white"}
                ${isSelected ? "bg-opacity-100" : "bg-transparent"}
              `}
            >
              <Icon className="w-5 h-5" />
            </div>
          )
        })}
      </div>

      {/* Winner dropdown (left) and W1 X W2 header (right) */}
      <div className="flex items-center justify-between px-4 lg:px-5 py-2 bg-[#3f3e3e]">
        <div>
          <Select defaultValue="winner">
            <SelectTrigger className="w-28 sm:w-32 bg-gray-800 border-gray-600 text-white text-xs sm:text-sm">
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
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">W1</div>
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">X</div>
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">W2</div>
        </div>
      </div>

      {/* Matches list */}
      <div className="flex flex-col">
        {matches.map((match) => {
          const isSelected = selectedGameId === match.id;

          return (
            <div
              key={match.id}
              onClick={() => handleGameClick(match.id)}
              className={`cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 py-1 sm:px-3 sm:py-2 m-0.5 bg-[#505050] transition-colors
        ${isSelected ? "bg-chart-5 text-white" : "hover:bg-[#606060]"}
      `}
            >
              {/* Match info section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-1 w-full sm:w-auto text-xs">
                {/* Clock and Time */}
                <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span className="whitespace-nowrap">{match.date}</span>
                </div>

                {/* Vertical fading divider */}
                <div className="h-5 w-px bg-gradient-to-b from-transparent via-muted-foreground to-transparent opacity-30 mx-2" />

                {/* Teams */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[11px] truncate text-primary-foreground">{match.team1}</div>
                  <div className="font-medium text-[11px] truncate text-primary-foreground">{match.team2}</div>
                </div>

                {/* Markets info */}
                <div className="text-muted-foreground text-[10px] self-start sm:self-center truncate ml-auto">
                  {match.additionalMarkets}
                </div>
              </div>

              {/* Odds section */}
              <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-10 sm:w-12 h-7 px-0 text-[11px] ${isSelected ? "bg-white text-black" : ""}`}
                >
                  {match.odds.w1}
                </Button>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-10 sm:w-12 h-7 px-0 text-[11px] ${isSelected ? "bg-white text-black" : ""}`}
                >
                  {match.odds.x}
                </Button>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`w-10 sm:w-12 h-7 px-0 text-[11px] ${isSelected ? "bg-white text-black" : ""}`}
                >
                  {match.odds.w2}
                </Button>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  )
}
