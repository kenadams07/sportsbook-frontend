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
    <nav className="bg-live-secondary border-b border-live px-2 sm:px-4 py-2 overflow-x-auto scrollbar-hide">
      {/* Desktop view - unchanged */}
      <div className="hidden md:flex items-center gap-1 sm:gap-2 h-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `h-full flex items-center px-3 sm:px-5 text-sm sm:text-base font-semibold transition-colors duration-200 border-b-2 whitespace-nowrap ${
                isActive
                  ? "text-live-primary border-live-accent bg-live-secondary font-bold"
                  : "text-live-muted border-transparent hover:text-live-primary hover:border-live-accent"
              }`
            }
            end
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      
      {/* Mobile view - pill/tab style like Dafabet */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `snap-start flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-live-accent text-live-dark shadow-md"
                  : "bg-live-tertiary text-live-primary hover:bg-live-hover border border-live"
              }`
            }
            end
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
