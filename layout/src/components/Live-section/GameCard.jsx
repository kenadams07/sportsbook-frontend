import React from "react";
import { Star } from "lucide-react";

function getMarketCount(markets) {
  if (!markets || typeof markets !== "object") {
    return 0;
  }

  return Object.values(markets).reduce((count, marketGroup) => {
    if (Array.isArray(marketGroup)) {
      return count + marketGroup.length;
    }

    return count;
  }, 0);
}

export default function GameCard({
  eventId,
  team1,
  team2,
  score1,
  score2,
  matchStatus,
  time,
  odds,
  league,
  sport,
  sportKey,
  markets,
  eventType = "MATCH",
  outrightRunners = [],
  highlight = false,
  oddsHighlight = { w1: false, x: false, w2: false },
  onClick,
}) {
  const isOutright = eventType === "OUTRIGHT";
  let team1Display = team1;
  let team2Display = team2;

  if (!isOutright && team1 && !team2) {
    const parts = team1.split(/\s*vs\.?\s*/i);
    if (parts.length === 2) {
      team1Display = parts[0].trim();
      team2Display = parts[1].trim();
    }
  }

  let displayTime = time;
  if (typeof time === "number" && time > 1000000000000) {
    displayTime = new Date(time).toLocaleString();
  } else if (typeof time === "string" && !Number.isNaN(new Date(time).getTime())) {
    displayTime = new Date(time).toLocaleString();
  }

  const isSuspended = odds.w1 === "SUSPENDED" && odds.x === "SUSPENDED" && odds.w2 === "SUSPENDED";
  const displayRunners = outrightRunners.slice(0, 3);
  const marketCount = getMarketCount(markets);

  return (
    <div
      className={`bg-live-primary rounded-md p-1.5 mb-1.5 border transition-all duration-300 ease-in-out ${
        highlight
          ? "border-live-accent shadow-[0_0_12px_var(--live-accent-primary)]"
          : "border-live shadow-sm hover:shadow-md"
      } cursor-pointer hover:bg-live-hover`}
      onClick={onClick}
      data-sport-key={sportKey}
      data-event-id={eventId}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] text-live-secondary font-semibold truncate">{league}</span>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] leading-none">
            <span className="text-live-muted uppercase">{matchStatus}</span>
            <span className="text-live-muted">|</span>
            <span className="text-live-accent truncate">{displayTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] bg-live-hover text-live-muted rounded px-1.5 py-0.5">+{marketCount}</span>
          <Star className="w-3.5 h-3.5 text-live-muted hover:text-live-accent" />
        </div>
      </div>

      {isOutright ? (
        <div className="mb-1.5">
          <span className="text-sm text-live-primary font-bold truncate block">{team1Display}</span>
          <span className="text-[10px] text-live-muted font-semibold uppercase">Outright</span>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto] gap-2 mb-1.5">
          <div className="min-w-0 space-y-0.5">
            <span className="block text-sm text-live-primary font-bold truncate">{team1Display}</span>
            <span className="block text-sm text-live-primary font-bold truncate">{team2Display}</span>
          </div>
          <div className="flex flex-col items-end justify-center leading-none">
            <span className="text-base text-live-accent font-bold">{score1}</span>
            <span className="text-base text-live-accent font-bold">{score2}</span>
          </div>
        </div>
      )}

      <div className="flex gap-1">
        {isSuspended ? (
          <div className="w-full flex items-center justify-center bg-live-odds rounded px-2 py-1.5">
            <span className="text-xs font-bold text-live-primary">SUSPENDED</span>
          </div>
        ) : isOutright ? (
          displayRunners.length > 0 ? (
            displayRunners.map((runner) => {
              const price = runner?.backPrices?.[0]?.price;
              return (
                <div key={runner.runnerName} className="flex-1 min-w-0 bg-live-odds rounded-md px-1.5 py-1 text-center">
                  <span className="block text-[10px] text-live-muted truncate">{runner.runnerName}</span>
                  <span className="inline-flex min-w-[44px] items-center justify-center rounded px-2 py-0.5 text-sm font-bold odds-value transition-all duration-300">
                    {typeof price === "number" ? price.toFixed(2) : "-"}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center bg-live-odds rounded px-2 py-1.5">
              <span className="text-xs font-bold text-live-muted">Awaiting outright odds</span>
            </div>
          )
        ) : (
          <>
            <div className="flex-1 bg-live-odds rounded-md px-1.5 py-1 text-center">
              <span className="block text-[10px] text-live-muted text-center">W1</span>
              <span className={`inline-flex min-w-[44px] items-center justify-center rounded px-2 py-0.5 text-sm font-bold odds-value transition-all duration-300 ${oddsHighlight?.w1 ? "odds-highlight" : ""}`}>{odds.w1}</span>
            </div>
            <div className="flex-1 bg-live-odds rounded-md px-1.5 py-1 text-center">
              <span className="block text-[10px] text-live-muted text-center">X</span>
              <span className={`inline-flex min-w-[44px] items-center justify-center rounded px-2 py-0.5 text-sm font-bold text-live-accent transition-all duration-300 ${oddsHighlight?.x ? "odds-highlight" : ""}`}>{odds.x}</span>
            </div>
            <div className="flex-1 bg-live-odds rounded-md px-1.5 py-1 text-center">
              <span className="block text-[10px] text-live-muted text-center">W2</span>
              <span className={`inline-flex min-w-[44px] items-center justify-center rounded px-2 py-0.5 text-sm font-bold odds-value transition-all duration-300 ${oddsHighlight?.w2 ? "odds-highlight" : ""}`}>{odds.w2}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
