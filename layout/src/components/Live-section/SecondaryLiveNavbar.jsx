import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Event View", to: "/live_events/event-view" },
  { label: "Live Calendar", to: "/live_events/live-calendar" },
  { label: "Results", to: "/live_events/results" },
  { label: "Statistics", to: "/live_events/statistics" },
  { label: "My Bets", to: "/live_events/my-bets" },
  { label: "Market Report", to: "/live_events/market-report" },
];

export default function SecondaryLiveNavbar() {
  return (
    <nav className="bg-live-secondary border-b border-live-accent px-2 sm:px-4 py-3 overflow-x-auto scrollbar-hide">
      {/* Desktop view - enhanced with better styling */}
      <div className="hidden md:flex items-center gap-1 sm:gap-1 h-12">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `h-full flex items-center justify-center px-4 py-2 text-sm font-medium border-b-3 whitespace-nowrap relative focus:outline-none focus:ring-0 ${
                isActive
                  ? "text-white bg-[#fbbf24] rounded-t-lg font-bold shadow-sm"
                  : "text-white hover:bg-[#fbbf24]/30"}
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      
      {/* Mobile view - enhanced pill/tab style */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 pt-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `snap-start flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-0 ${
                isActive
                  ? "bg-[#fbbf24] text-white font-bold shadow-md"
                  : "bg-live-secondary text-white hover:bg-[#fbbf24]/30 border border-live"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
