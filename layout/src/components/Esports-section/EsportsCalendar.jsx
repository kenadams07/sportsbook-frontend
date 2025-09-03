"use client"

import React from "react"
import SecondaryEsportsNavbar from "./SecondaryEsportsNavbar"
import LiveCalender from "../Live-section/LiveCalender"

export default function EsportsCalendar() {
  return (
    <div className="flex flex-col w-full bg-[#1a1a1a] text-white h-full">
      {/* Secondary Navigation Bar */}
      <SecondaryEsportsNavbar />
      
      {/* Reuse the LiveCalender component with ESports styling */}
      <div className="flex-1 px-4 py-2">
        <LiveCalender />
      </div>
    </div>
  )
}