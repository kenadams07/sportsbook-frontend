// Dummy GameCard Component

import React from 'react';
import { Button } from "../ui/button";

function DummyGameCard({ team1, team2, w1, w2 }) {
  return (
    <div className="bg-[#3e3e3e] rounded-md p-4 mb-4 mx-2 flex flex-col justify-between text-sm">
      {/* Game Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <span className="font-semibold">{team1}</span>
          <span className="text-muted-foreground">vs</span>
          <span className="font-semibold">{team2}</span>
        </div>
      </div>

      {/* Odds */}
      <div className="flex gap-2">
        <Button size="sm" className="w-16 text-xs">
          {w1}
        </Button>
        <Button size="sm" className="w-16 text-xs">
          {w2}
        </Button>
      </div>
    </div>
  );
}

export default DummyGameCard;
