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
      <div className="flex items-center justify-center h-full text-live-muted text-sm">
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

  // Extract team names from eventName
  const teamNames = match.eventName ? match.eventName.split(' vs. ') : ['Team 1', 'Team 2'];
  const team1 = teamNames[0] || 'Team 1';
  const team2 = teamNames[1] || 'Team 2';

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
        <div className="absolute inset-0 flex flex-col text-white">
          {/* Top section with flag and competition */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-live-info border border-live-primary rounded-sm flex items-center justify-center">
                <span className="text-live-primary text-xs font-bold">🇬🇧</span>
              </div>
              <span className="text-live-primary text-sm font-medium">{match.competitionName || 'League'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-live-dark text-xs px-2 py-1 bg-live-accent rounded">
                {match.status === 'IN_PLAY' ? '2nd Half' : match.status}
              </span>
              <span className="text-live-accent text-lg font-bold">
                {match.status === 'IN_PLAY' ? '81' : '0'}
              </span>
            </div>
          </div>

          {/* Middle section with teams and scores */}
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="w-full flex items-center justify-between" style={{ background: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "8px" }}>
              {/* Left side - Teams */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-live-danger text-lg">★</span>
                  <span className="text-live-primary text-lg font-medium">{team1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-live-accent text-lg">★</span>
                  <span className="text-live-primary text-lg font-medium">{team2}</span>
                </div>
              </div>

              {/* Center - Score display */}
              <div className="text-center">
                <div className="text-live-primary text-lg font-bold">
                  {match.homeScore ?? '3'}-{match.awayScore ?? '2'} (2-1) (1-1) 81'
                </div>
              </div>

              {/* Right side - Current scores */}
              <div className="text-right space-y-3">
                <div className="text-live-primary text-2xl font-bold">{match.homeScore ?? '3'}</div>
                <div className="text-live-primary text-2xl font-bold">{match.awayScore ?? '2'}</div>
              </div>
            </div>
          </div>

          {/* Bottom center - Action buttons */}
          <div className="flex justify-center pb-4">
            <div className="flex gap-2">
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary px-4 py-2 rounded text-sm">
                Stats
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-2 rounded">
                ⚡
              </button>
              <button className="bg-live-tertiary hover:bg-live-hover text-live-primary p-2 rounded">
                📊
              </button>
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

  // Split into two columns for responsive layout
  const leftColumn = [];
  const rightColumn = [];
  items.forEach((it, idx) => {
    if (idx % 2 === 0) leftColumn.push(it);
    else rightColumn.push(it);
  });

  return (
    <div className="text-live-primary">
      {/* Parent Market Header - Keep existing functionality */}
      <button
        type="button"
        onClick={toggleMarket}
        className="w-full flex items-center justify-between px-4 py-3 hover:opacity-90 transition-opacity bg-live-primary border border-live-accent rounded-t-md"
        aria-expanded={isMarketOpen}
      >
        <span className="text-sm font-bold tracking-wide text-live-accent">Market</span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-80 text-live-accent">{items.length} panels</span>
          {isMarketOpen ? <IoChevronUp className="w-5 h-5 text-live-accent" /> : <IoChevronDown className="w-5 h-5 text-live-accent" />}
        </div>
      </button>

      {/* Responsive 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2  rounded-b-md bg-live-tertiary">
        {/* Left column */}
        <div className="space-y-1">
          {leftColumn.map((it) => {
            const open = !!expandedById[it.id];
            const measured = heights[it.id] ?? 0;
            return (
              <div
                key={it.id}
                className="transition-colors overflow-hidden bg-live-primary  rounded-md"
              >
                {/* Market item header */}
                <button
                  type="button"
                  onClick={() => toggleItem(it.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-live-hover transition-colors"
                  aria-expanded={open}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-live-accent">⭐</span>
                    <span className="text-live-primary font-medium truncate">{it.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-live-dark text-xs px-2 py-1 bg-live-accent rounded">🔗</span>
                    <span className="text-live-accent text-sm">1</span>
                    <span className="text-live-accent text-lg">📊</span>
                    {open ? <IoChevronUp className="w-4 h-4 text-live-primary" /> : <IoChevronDown className="w-4 h-4 text-live-primary" />}
                  </div>
                </button>

                {/* Collapsible content */}
                <div
                  style={{
                    maxHeight: open ? `${measured}px` : "0px",
                    transition: "max-height 280ms ease, opacity 200ms ease",
                    overflow: "hidden",
                    backgroundColor: "var(--live-bg-tertiary)",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <div
                    ref={(el) => {
                      contentRefs.current[it.id] = el;
                    }}
                  >
                    <div className="px-4 pb-3 pt-2">
                      <ul className="text-sm text-live-primary space-y-1">
                        {(it.rows || []).map((r, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between py-2 px-3 rounded bg-live-hover"
                          >
                            <span className="text-live-primary truncate">{r.label}</span>
                            <span className="text-sm px-3 py-1 rounded font-medium flex-shrink-0 bg-live-tertiary text-live-primary">
                              {r.value}
                            </span>
                          </li>
                        ))}
                        {!it.rows?.length && (
                          <li className="px-3 py-2 text-live-secondary">No data available</li>
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
        <div className="space-y-1">
          {rightColumn.map((it) => {
            const open = !!expandedById[it.id];
            const measured = heights[it.id] ?? 0;
            return (
              <div
                key={it.id}
                className="transition-colors overflow-hidden bg-live-primary  rounded-md"
              >
                {/* Market item header */}
                <button
                  type="button"
                  onClick={() => toggleItem(it.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-live-hover transition-colors"
                  aria-expanded={open}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-live-accent">⭐</span>
                    <span className="text-live-primary font-medium truncate">{it.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-live-dark text-xs px-2 py-1 bg-live-accent rounded">🔗</span>
                    <span className="text-live-accent text-sm">1</span>
                    <span className="text-live-accent text-lg">📊</span>
                    {open ? <IoChevronUp className="w-4 h-4 text-live-primary" /> : <IoChevronDown className="w-4 h-4 text-live-primary" />}
                  </div>
                </button>

                {/* Collapsible content */}
                <div
                  style={{
                    maxHeight: open ? `${measured}px` : "0px",
                    transition: "max-height 280ms ease, opacity 200ms ease",
                    overflow: "hidden",
                    backgroundColor: "var(--live-bg-tertiary)",
                    opacity: open ? 1 : 0,
                  }}
                >
                  <div
                    ref={(el) => {
                      contentRefs.current[it.id] = el;
                    }}
                  >
                    <div className="px-4 pb-3 pt-2">
                      <ul className="text-sm text-live-primary space-y-1">
                        {(it.rows || []).map((r, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between py-2 px-3 rounded bg-live-hover"
                          >
                            <span className="text-live-primary truncate">{r.label}</span>
                            <span className="text-sm px-3 py-1 rounded font-medium flex-shrink-0 bg-live-tertiary text-live-primary">
                              {r.value}
                            </span>
                          </li>
                        ))}
                        {!it.rows?.length && (
                          <li className="px-3 py-2 text-live-secondary">No data available</li>
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
  );
}

// SleekNavbar component (unchanged core behavior)
function SleekNavbar() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div
      className={`sleek-navbar shadow-md rounded-md p-2 flex items-center gap-4 transition-all duration-300 bg-live-hover ${
        searchActive ? "navbar-search-active" : ""
      }`}
    >
      {!searchActive ? (
        <>
          {/* Search Icon */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 rounded-md hover:bg-live-primary transition-colors"
            onClick={() => setSearchActive(true)}
            aria-label="Search"
          >
            <IoSearchOutline className="h-5 w-5 text-live-primary " />
          </button>
          {/* Tabs: All, Match, Totals */}
          <div className="flex gap-6">
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "All" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("All")}
            >
              All
              {activeTab === "All" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "Match" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("Match")}
            >
              Match
              {activeTab === "Match" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
            <button
              className={`py-2 px-1 text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                activeTab === "Totals" ? "text-live-accent border-b-2 border-yellow-500 pb-1" : "text-live-secondary hover:text-live-primary"
              }`}
              onClick={() => setActiveTab("Totals")}
            >
              Totals
              {activeTab === "Totals" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-live-accent"></div>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Close Icon - replaces search icon when search is active */}
          <button
            className="search-icon-btn flex items-center justify-center w-9 h-9 rounded-md hover:bg-live-primary transition-colors"
            onClick={() => {
              setSearchActive(false);
              setSearchValue("");
            }}
            aria-label="Close search"
          >
            <IoCloseOutline className="h-5 w-5 text-live-primary" />
          </button>
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 pl-10 pr-4 rounded-md border border-live-accent focus:outline-none focus:ring-1 focus:ring-live-accent focus:border-live-accent bg-live-tertiary text-live-primary transition-all duration-300"
            />
            <span className="absolute left-3 top-2.5 text-live-muted">
              <IoSearchOutline className="h-5 w-5" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}
