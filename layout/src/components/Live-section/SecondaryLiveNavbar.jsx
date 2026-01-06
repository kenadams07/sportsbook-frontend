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
    <nav className="flex bg-live-secondary border-b border-live px-2 sm:px-6 h-12 items-center gap-1 sm:gap-2 overflow-x-auto">
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
    </nav>
  );
}
