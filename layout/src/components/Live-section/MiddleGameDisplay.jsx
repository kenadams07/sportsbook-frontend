"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoSearchOutline, IoCloseOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";

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

export default function MiddleGameDisplay({ match, sport, marketItems }) {
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
  if (typeof displayTime === "number" && displayTime > 1000000000000) {
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
            <div className="text-sm mt-2">{match.league || match.competitionName || ""}</div>
          </div>
          {/* Match Details Inline at Bottom */}
          <div
            className="absolute bottom-0 left-0 w-full flex items-center justify-center text-xs"
            style={{ background: "rgba(0,0,0,0.22)", height: "32px" }}
          >
            <div className="flex items-center w-full justify-center">
              <span className="px-2 text-gray-200">
                Status: {match.matchStatus || match.status}
              </span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">Time: {displayTime}</span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">
                Score: {match.score1 ?? "-"} - {match.score2 ?? "-"}
              </span>
              <span className="border-l border-gray-400 h-4 mx-2"></span>
              <span className="px-2 text-gray-200">
                League: {match.league || match.competitionName || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Navbar Below Image */}
      <SleekNavbar />

      {/* Market Section */}
      <MarketSection marketItems={marketItems} />
    </div>
  );
}

/**
 * MarketSection
 * - Two column flex layout (two vertical stacks) so items never jump columns.
 * - Smooth expand/collapse by animating max-height using measured scrollHeight.
 * - Panel shell color: #3c3c3c, content background: #626262
 */
function MarketSection({ marketItems }) {
  // Dummy fallback data if not passed via props
  const defaults = useMemo(
    () => [
      {
        id: "match_winner",
        title: "Match Winner",
        rows: [
          { label: "Team 1", value: "1.85" },
          { label: "Draw", value: "3.20" },
          { label: "Team 2", value: "2.05" },
        ],
      },
      {
        id: "total_goals",
        title: "Total Goals",
        rows: [
          { label: "Over 2.5", value: "1.95" },
          { label: "Under 2.5", value: "1.90" },
        ],
      },
      {
        id: "handicap",
        title: "Handicap",
        rows: [
          { label: "Team 1 -1", value: "2.75" },
          { label: "Team 2 +1", value: "1.45" },
        ],
      },
      {
        id: "btts",
        title: "Both Teams to Score",
        rows: [
          { label: "Yes", value: "1.80" },
          { label: "No", value: "1.95" },
        ],
      },
      {
        id: "correct_score",
        title: "Correct Score",
        rows: [
          { label: "1-0", value: "7.50" },
          { label: "1-1", value: "6.00" },
          { label: "2-1", value: "9.00" },
        ],
      },
      {
        id: "first_half",
        title: "First Half",
        rows: [
          { label: "Team 1", value: "2.40" },
          { label: "Draw", value: "2.00" },
          { label: "Team 2", value: "3.10" },
        ],
      },
    ],
    []
  );

  const items = Array.isArray(marketItems) && marketItems.length ? marketItems : defaults;

  // Parent only toggles child states; the two-column layout preserves column positions
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  // Track expanded state per child panel
  const [expandedById, setExpandedById] = useState(() => {
    const init = {};
    items.forEach((it) => (init[it.id] = true));
    return init;
  });

  // Reset child states when items change to keep them aligned with parent
  useEffect(() => {
    const next = {};
    items.forEach((it) => (next[it.id] = isMarketOpen));
    setExpandedById(next);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // refs for measuring each panel's content height
  const contentRefs = useRef({});
  const [heights, setHeights] = useState({});

  // Measure heights whenever items, expansion changes or window resizes
  useEffect(() => {
    const measure = () => {
      const next = {};
      items.forEach((it) => {
        const node = contentRefs.current[it.id];
        if (node) {
          // If inner wrapper exists, read scrollHeight (full content height)
          next[it.id] = node.scrollHeight;
        }
      });
      setHeights(next);
    };

    // measure on next paint to ensure DOM is ready
    requestAnimationFrame(measure);

    const onResize = () => {
      // debounce not necessary here; single handler is fine
      requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items, expandedById]);

  const toggleMarket = () => {
    setIsMarketOpen((prev) => {
      const nextOpen = !prev;
      setExpandedById((old) => {
        const updated = {};
        items.forEach((it) => (updated[it.id] = nextOpen));
        return updated;
      });
      return nextOpen;
    });
  };

  const toggleItem = (id) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Stable split into two columns by index so each item always remains in same column
  const leftColumn = [];
  const rightColumn = [];
  items.forEach((it, idx) => {
    if (idx % 2 === 0) leftColumn.push(it);
    else rightColumn.push(it);
  });

  return (
    <div className="rounded-md shadow-md text-white" style={{ backgroundColor: "#505050" }}>
      {/* Parent Market Header */}
      <button
        type="button"
        onClick={toggleMarket}
        className="w-full flex items-center justify-between px-4 py-2 hover:opacity-90 transition-opacity rounded-t-md"
        aria-expanded={isMarketOpen}
      >
        <span className="text-sm font-bold tracking-wide">Market</span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-80">{items.length} panels</span>
          {isMarketOpen ? <IoChevronUp className="w-5 h-5" /> : <IoChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Two-column layout: left & right vertical stacks */}
      <div className="p-3 pt-2">
        <div className="flex gap-3">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-3">
            {leftColumn.map((it) => {
              const open = !!expandedById[it.id];
              const measured = heights[it.id] ?? 0;
              return (
                <div
                  key={it.id}
                  className="rounded-md border transition-colors overflow-hidden"
                  style={{
                    backgroundColor: "#3c3c3c",
                    borderColor: "rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Child Header */}
                  <button
                    type="button"
                    onClick={() => toggleItem(it.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold"
                    aria-expanded={open}
                  >
                    <span className="truncate">{it.title}</span>
                    {open ? <IoChevronUp className="w-4 h-4" /> : <IoChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Collapsible content — animate max-height using measured height */}
                  <div
                    style={{
                      maxHeight: open ? `${measured}px` : "0px",
                      transition: "max-height 280ms ease, opacity 200ms ease",
                      overflow: "hidden",
                      backgroundColor: "#626262",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    {/* content wrapper that we measure (ref here) */}
                    <div
                      ref={(el) => {
                        contentRefs.current[it.id] = el;
                      }}
                    >
                      <div className="px-3 pb-3 pt-2">
                        <ul className="text-xs text-white/95 divide-y" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                          {(it.rows || []).map((r, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between px-3 py-2"
                              style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                            >
                              <span className="truncate">{r.label}</span>
                              <span
                                className="text-[11px] px-2 py-1 rounded border"
                                style={{
                                  backgroundColor: "#3c3c3c",
                                  borderColor: "rgba(255,255,255,0.18)",
                                }}
                              >
                                {r.value}
                              </span>
                            </li>
                          ))}
                          {!it.rows?.length && (
                            <li className="px-3 py-2 text-white/80">No data available</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col gap-3">
            {rightColumn.map((it) => {
              const open = !!expandedById[it.id];
              const measured = heights[it.id] ?? 0;
              return (
                <div
                  key={it.id}
                  className="rounded-md border transition-colors overflow-hidden"
                  style={{
                    backgroundColor: "#3c3c3c",
                    borderColor: "rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Child Header */}
                  <button
                    type="button"
                    onClick={() => toggleItem(it.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold"
                    aria-expanded={open}
                  >
                    <span className="truncate">{it.title}</span>
                    {open ? <IoChevronUp className="w-4 h-4" /> : <IoChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Collapsible content */}
                  <div
                    style={{
                      maxHeight: open ? `${measured}px` : "0px",
                      transition: "max-height 280ms ease, opacity 200ms ease",
                      overflow: "hidden",
                      backgroundColor: "#626262",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <div
                      ref={(el) => {
                        contentRefs.current[it.id] = el;
                      }}
                    >
                      <div className="px-3 pb-3 pt-2">
                        <ul className="text-xs text-white/95 divide-y" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                          {(it.rows || []).map((r, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between px-3 py-2"
                              style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                            >
                              <span className="truncate">{r.label}</span>
                              <span
                                className="text-[11px] px-2 py-1 rounded border"
                                style={{
                                  backgroundColor: "#3c3c3c",
                                  borderColor: "rgba(255,255,255,0.18)",
                                }}
                              >
                                {r.value}
                              </span>
                            </li>
                          ))}
                          {!it.rows?.length && (
                            <li className="px-3 py-2 text-white/80">No data available</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* subtle bottom edge */}
      <div className="h-1 rounded-b-md" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

// SleekNavbar component (unchanged core behavior)
function SleekNavbar() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div
      className={`sleek-navbar shadow-md rounded-md p-2 flex items-center gap-4 transition-all duration-300 ${
        searchActive ? "navbar-search-active" : ""
      }`}
      style={{ backgroundColor: "rgb(70, 70, 70)" }}
    >
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
                activeTab === "All" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
              {activeTab === "All" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#fdd835" }}></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === "Match" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("Match")}
            >
              Match
              {activeTab === "Match" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#fdd835" }}></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === "Totals" ? "text-white" : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveTab("Totals")}
            >
              Totals
              {activeTab === "Totals" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#fdd835" }}></div>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Close Icon - replaces search icon when search is active */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => {
              setSearchActive(false);
              setSearchValue("");
            }}
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
              onChange={(e) => setSearchValue(e.target.value)}
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
