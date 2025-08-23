"use client"

import { useState } from "react"
import LeftSidebarEventView from "./LeftSidebarEventView"
import MiddleGameDisplay from "./MiddleGameDisplay"
import RightEventInfoSection from "./RightEventInfoSection"

export default function MainLiveSection() {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)

  // Prepare info for RightEventInfoSection
  const rightEventInfo = selectedMatch
    ? {
        team1: selectedMatch.team1,
        team2: selectedMatch.team2,
        timeLabel: selectedMatch.openDate || selectedMatch.time || '',
        odds: {
          w1: selectedMatch.odds?.w1 ?? '-',
          w2: selectedMatch.odds?.w2 ?? '-',
        },
      }
    : null;
      console.log("rightEventInfo",selectedMatch);
  return (
    <div className="flex w-full h-[calc(100vh-60px)] bg-live-primary text-live-primary gap-3">
      {/* Left section: sidebar */}
      <div className="w-[18%] min-w-[230px] max-w-[360px] overflow-y-auto">
        <LeftSidebarEventView
          setSelectedMatch={setSelectedMatch}
          setSelectedSport={setSelectedSport}
          selectedMatch={selectedMatch} 
        />
      </div>

      {/* Middle section: game display */}
      <div className="flex-1 overflow-y-auto">
        <MiddleGameDisplay match={selectedMatch} sport={selectedSport} />
      </div>

      {/* Right section: extra info */}
      <div className="w-[25%] min-w-[220px] max-w-[320px] overflow-y-auto">
        <RightEventInfoSection selectedGame={rightEventInfo} />
      </div>
    </div>
  )
}
