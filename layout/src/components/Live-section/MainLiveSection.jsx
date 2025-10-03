"use client"

import { useState, useEffect, useRef } from "react"
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
  const selectedRunnerRef = useRef(null);

  // Function to update the selected match with new odds
  const updateSelectedMatchOdds = (updatedMatch) => {
    setSelectedMatch(prevMatch => {
      // Only update if this is the same match that's currently selected
      if (prevMatch && prevMatch.eventId === updatedMatch.eventId) {
        // Preserve market runner selection if it exists
        if (selectedRunnerRef.current && selectedRunnerRef.current.eventId === updatedMatch.eventId) {
          return {
            ...updatedMatch,
            selectedMarket: selectedRunnerRef.current.selectedMarket,
            selectedRunner: selectedRunnerRef.current.selectedRunner,
            selectedOdd: selectedRunnerRef.current.selectedOdd
          };
        }
        return updatedMatch;
      }
      return prevMatch;
    });
  };

  // Handle runner selection from middle section
  const handleRunnerSelect = (runnerInfo) => {
    // Store the selected runner info in ref to persist across re-renders
    selectedRunnerRef.current = runnerInfo;
    
    // Also update the selected match with the market runner info
    setSelectedMatch(prevMatch => {
      if (prevMatch && prevMatch.eventId === runnerInfo.eventId) {
        return {
          ...prevMatch,
          selectedMarket: runnerInfo.selectedMarket,
          selectedRunner: runnerInfo.selectedRunner,
          selectedOdd: runnerInfo.selectedOdd
        };
      }
      return prevMatch;
    });
  };

  // Reset market runner selection when a new match is selected
  useEffect(() => {
    if (selectedMatch) {
      // If there's no current runner selection or it's for a different match, clear the ref
      if (selectedRunnerRef.current && selectedRunnerRef.current.eventId !== selectedMatch.eventId) {
        selectedRunnerRef.current = null;
      }
      // If the new selected match doesn't have market info but we have a selection, apply it
      else if (selectedRunnerRef.current && !selectedMatch.selectedMarket) {
        setSelectedMatch(prevMatch => ({
          ...prevMatch,
          selectedMarket: selectedRunnerRef.current.selectedMarket,
          selectedRunner: selectedRunnerRef.current.selectedRunner,
          selectedOdd: selectedRunnerRef.current.selectedOdd
        }));
      }
    }
  }, [selectedMatch]);

  // Prepare info for RightEventInfoSection
  const rightEventInfo = selectedMatch && selectedMatch.selectedMarket 
    ? selectedMatch  // Use the full selected match with market info
    : (selectedMatch
      ? {
          ...selectedMatch,
          team1: selectedMatch.team1,
          team2: selectedMatch.team2,
          timeLabel: selectedMatch.openDate || selectedMatch.time || '',
        }
      : null);
     
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
        <MiddleGameDisplay 
          match={selectedMatch} 
          sport={selectedSport} 
          onRunnerSelect={handleRunnerSelect}
        />
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