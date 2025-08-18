"use client"

export default function RightEventInfoSection({ selectedGame }) {
  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select a game to see details
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Event Info</h2>

      <div className="bg-[#505050] p-3 rounded-md">
        <p className="text-sm">Team 1: {selectedGame.team1}</p>
        <p className="text-sm">Team 2: {selectedGame.team2}</p>
        <p className="text-sm">Time: {selectedGame.timeLabel}</p>
        <p className="text-sm">Odds: W1 - {selectedGame.odds.w1}, W2 - {selectedGame.odds.w2}</p>
      </div>

      <div className="bg-[#505050] p-3 rounded-md h-32 flex items-center justify-center text-gray-300">
        Additional Event Info / Stats
      </div>
    </div>
  )
}
