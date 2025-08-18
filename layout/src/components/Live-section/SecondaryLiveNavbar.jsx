import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Event View", to: "/live_events/event-view" },
  { label: "Live Calendar", to: "/live_events/live-calendar" },
  { label: "Results", to: "/live_events/results" },
  { label: "Statistics", to: "/live_events/statistics" },
];

export default function SecondaryLiveNavbar() {
  return (
    <nav className="flex bg-[#232323] border-b border-[#444] px-6 h-12 items-center gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `h-full flex items-center px-5 text-base font-semibold transition-colors duration-200 border-b-2 ${
              isActive
                ? "text-white border-yellow-400 bg-[#232323] font-bold"
                : "text-gray-400 border-transparent hover:text-white hover:border-yellow-400"
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
