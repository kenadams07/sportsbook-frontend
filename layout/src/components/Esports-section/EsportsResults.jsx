"use client"

import React from "react"
import SecondaryEsportsNavbar from "./SecondaryEsportsNavbar"
import Results from "../Live-section/Results"

export default function EsportsResults() {
  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] text-white h-full">
      {/* Secondary Navigation Bar */}
      <SecondaryEsportsNavbar />
      
      {/* Reuse the Results component with ESports styling */}
      <div className="flex-1">
        <Results />
      </div>
    </div>
  )
}