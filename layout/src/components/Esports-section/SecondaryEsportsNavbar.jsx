import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Event View", to: "/esports/event-view" },
  { label: "Live Calendar", to: "/esports/live-calendar" },
  { label: "Results", to: "/esports/results" },
  { label: "Statistics", to: "/esports/statistics" },
];

export default function SecondaryEsportsNavbar() {
  return (
    <nav className="flex bg-black border-b border-[#333] h-12 items-center px-0">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `h-full flex items-center px-4 text-sm font-medium transition-colors duration-200 ${isActive 
              ? "text-white border-b-2 border-[#fbbf24]" 
              : "text-gray-400 hover:text-white"}`
          }
          end
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}