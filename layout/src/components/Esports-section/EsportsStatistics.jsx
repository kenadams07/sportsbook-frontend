"use client"

import React from "react"
import SecondaryEsportsNavbar from "./SecondaryEsportsNavbar"

const Statistics = () => <div style={{color: 'white', padding: 24}}>ESports Statistics Page</div>;

export default function EsportsStatistics() {
  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] text-white h-full">
      {/* Secondary Navigation Bar */}
      <SecondaryEsportsNavbar />
      
      {/* Statistics component */}
      <div className="flex-1">
        <Statistics />
      </div>
    </div>
  )
}