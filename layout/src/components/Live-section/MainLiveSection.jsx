"use client"

import { useState } from "react"
import LeftAllEventsBar from "./LeftAllEventsBar"
import MiddleGameDisplay from "./MiddleGameDisplay"
import RightEventInfoSection from "./RightEventInfoSection"

export default function MainLiveSection({ events }) {
  // Shared selected game
  const [selectedGame, setSelectedGame] = useState(null)

  return (
    <div className="flex w-full h-[calc(100vh-60px)] bg-[#3f3e3e] text-white">
      {/* Left section: all events */}
      <div className="w-[25%] border-r border-gray-600 overflow-y-auto">
        <LeftAllEventsBar
          events={events}
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
        />
      </div>

      {/* Middle section: game display */}
      <div className="flex-1 border-r border-gray-600 overflow-y-auto">
        <MiddleGameDisplay selectedGame={selectedGame} />
      </div>

      {/* Right section: extra info */}
      <div className="w-[25%] overflow-y-auto">
        <RightEventInfoSection selectedGame={selectedGame} />
      </div>
    </div>
  )
}
