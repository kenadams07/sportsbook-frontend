"use client";

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

export default function MiddleGameDisplay({ match, sport }) {
  if (!match || !sport) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select a game to see details
      </div>
    );
  }

  const sportKey =
    sport?.key?.toLowerCase?.() ||
    sport?.name?.toLowerCase?.() ||
    sport?.toLowerCase?.() ||
    "";

  const imageSrc = sportImageMap[sportKey] || "/assets/img1.jpg";
  

  // Convert openDate/time to readable format
  let displayTime = match.time || match.openDate;
  if (typeof displayTime === 'number' && displayTime > 1000000000000) {
    const dateObj = new Date(displayTime);
    displayTime = dateObj.toLocaleString();
  }

  return (
    <div className="p-2 flex flex-col gap-4 h-full min-w-0">
      {/* Top Section with Background Image */}
      <div className="relative w-full h-64 rounded-md overflow-hidden">
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
        <div className="absolute inset-0 flex flex-col justify-center items-start text-white text-left">
          <div className="w-full py-4 pl-6" style={{ background: "rgba(0,0,0,0.32)" }}>
            <div className="text-2xl font-bold">
              {match.team1} vs {match.team2}
            </div>
            <div className="text-sm mt-2">
              {match.league || match.competitionName || ""}
            </div>
          </div>
          {/* Match Details Inline at Bottom */}
          <div className="absolute bottom-0 left-0 w-full flex items-center justify-center text-xs" style={{ background: "rgba(0,0,0,0.22)", height: '32px' }}>
            <div className="flex items-center w-full justify-center">
              <span className="px-2 text-gray-200">Status: {match.matchStatus || match.status}</span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">Time: {displayTime}</span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">Score: {match.score1 ?? "-"} - {match.score2 ?? "-"}</span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">League: {match.league || match.competitionName || ""}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Sleek Navbar Below Image */}
      <SleekNavbar />
    </div>
  );
}

// SleekNavbar component
import React, { useState } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

function SleekNavbar() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className={`sleek-navbar shadow-md rounded-md p-2 flex items-center gap-4 transition-all duration-300 ${searchActive ? "navbar-search-active" : ""}`} style={{ backgroundColor: 'rgb(70, 70, 70)' }}> 
      {!searchActive ? (
        <>
          {/* Search Icon */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => setSearchActive(true)}
            aria-label="Search"
          >
            <IoSearchOutline className="h-5 w-5 text-white" />
          </button>
          {/* Tabs: All, Match, Totals */}
          <div className="flex gap-6">
            <button 
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === "All" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
              {activeTab === "All" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#fdd835' }}></div>
              )}
            </button>
            <button 
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === "Match" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("Match")}
            >
              Match
              {activeTab === "Match" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#fdd835' }}></div>
              )}
            </button>
            <button 
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === "Totals" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("Totals")}
            >
              Totals
              {activeTab === "Totals" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#fdd835' }}></div>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Close Icon - replaces search icon when search is active */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => { setSearchActive(false); setSearchValue(""); }}
            aria-label="Close search"
          >
            <IoCloseOutline className="h-5 w-5 text-white" />
          </button>
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 pl-10 pr-4 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <IoSearchOutline className="h-5 w-5" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
