"use client"

import { useState } from "react"
import LeftSidebarEventView from "./LeftSidebarEventView"
import MiddleGameDisplay from "./MiddleGameDisplay"
import RightEventInfoSection from "./RightEventInfoSection"
import LoginModal from "../../modals/LoginModal"
import RegisterModal from "../../modals/RegisterModal"

export default function MainLiveSection() {
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  // Function to update the selected match with new odds
  const updateSelectedMatchOdds = (updatedMatch) => {
    setSelectedMatch(prevMatch => {
      // Only update if this is the same match that's currently selected
      if (prevMatch && prevMatch.eventId === updatedMatch.eventId) {
        return updatedMatch;
      }
      return prevMatch;
    });
  };

  // Prepare info for RightEventInfoSection
  const rightEventInfo = selectedMatch
    ? {
        ...selectedMatch,
        team1: selectedMatch.team1,
        team2: selectedMatch.team2,
        timeLabel: selectedMatch.openDate || selectedMatch.time || '',
      }
    : null;
     
  return (
    <div className="flex w-full h-[calc(100vh-60px)] bg-live-primary text-live-primary gap-3">
      {/* Left section: sidebar */}
      <div className="w-[18%] min-w-[230px] max-w-[360px] overflow-y-auto">
        <LeftSidebarEventView
          setSelectedMatch={setSelectedMatch}
          setSelectedSport={setSelectedSport}
          selectedMatch={selectedMatch} 
          onSelectedMatchOddsUpdate={updateSelectedMatchOdds}
        />
      </div>

      {/* Middle section: game display */}
      <div className="flex-1 overflow-y-auto">
        <MiddleGameDisplay match={selectedMatch} sport={selectedSport} />
      </div>

      {/* Right section: extra info */}
      <div className="w-[25%] min-w-[220px] max-w-[320px] overflow-y-auto">
        <RightEventInfoSection 
          selectedGame={rightEventInfo} 
          onLogin={() => setIsLoginModalOpen(true)}
          onRegister={() => setIsRegisterModalOpen(true)}
        />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false)
          setIsRegisterModalOpen(true)
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCloseAll={() => {
          setIsRegisterModalOpen(false)
          setIsLoginModalOpen(false)
        }}
      />
    </div>
  )
}
