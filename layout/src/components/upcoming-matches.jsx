"use client"

import { useState } from "react"
import { Clock, Star, TrendingUp, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function Component() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("0-15M")

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

  const timeFilters = ["0-15M", "15-30M", "30-60M"]

  return (
    <div className="bg-[#3f3e3e] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b border-gray-700 gap-3 sm:gap-0">
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
                className={`text-xs px-2 py-1 sm:px-3 sm:py-2 ${
                  selectedTimeFilter === filter
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

      {/* Winner dropdown */}
      <div className="p-3 sm:p-4 border-b border-gray-700">
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

      {/* Odds header - Hidden on mobile, shown on tablet+ */}
      <div className="hidden sm:flex items-center justify-end px-4 lg:px-5 py-2 border-b border-gray-700 bg-[#3f3e3e]">
        <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">W1</div>
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">X</div>
          <div className="w-12 sm:w-16 bg-[#505050] flex items-center justify-center h-8 sm:h-12 text-center">W2</div>
        </div>
      </div>

      {/* Matches list */}
      <div className="flex flex-col divide-gray-700">
        {matches.map((match) => (
          <div
            key={match.id}
            className="rounded-sm cursor-pointer m-1 sm:m-2 flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#505050] hover:bg-gray-800 transition-colors gap-3 sm:gap-0"
          >
            {/* Match info section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
              {/* Date and time */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{match.date}</span>
              </div>

              {/* Teams */}
              <div className="flex-1 w-[100px]">
                <div className="font-medium text-sm sm:text-base truncate">{match.team1}</div>
                <div className="font-medium text-sm sm:text-base truncate">{match.team2}</div>
              </div>

              {/* Additional info */}
              <div className="flex items-center gap-2 self-end sm:self-center mr-2">
                <span className="text-xs sm:text-sm text-gray-400">{match.additionalMarkets}</span>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                {match.isFavorite && <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />}
              </div>
            </div>

            {/* Odds section */}
            <div className="flex gap-1 sm:gap-3 w-full sm:w-auto justify-end">
              {/* Mobile odds header */}
              <div className="flex sm:hidden gap-1 w-full">
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-gray-400 text-center mb-1">W1</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs"
                  >
                    {match.odds.w1}
                  </Button>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-gray-400 text-center mb-1">X</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs"
                  >
                    {match.odds.x}
                  </Button>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-gray-400 text-center mb-1">W2</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs"
                  >
                    {match.odds.w2}
                  </Button>
                </div>
              </div>

              {/* Desktop odds */}
              <div className="hidden sm:flex gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 cursor-pointer sm:w-16 h-8 sm:h-12 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs sm:text-sm"
                >
                  {match.odds.w1}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 cursor-pointer sm:w-16 h-8 sm:h-12 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs sm:text-sm"
                >
                  {match.odds.x}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 cursor-pointer sm:w-16 h-8 sm:h-12 rounded-none bg-gray-500 hover:bg-yellow-500 text-yellow-500 hover:text-black font-semibold text-xs sm:text-sm"
                >
                  {match.odds.w2}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
