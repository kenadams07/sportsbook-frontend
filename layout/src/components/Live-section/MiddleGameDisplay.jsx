"use client"

export default function MiddleGameDisplay({ selectedGame }) {
  if (!selectedGame) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select a game to see details
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">{selectedGame.team1} vs {selectedGame.team2}</h2>
      <div className="bg-[#505050] h-64 rounded-md flex items-center justify-center text-gray-300">
        Game Display Area (dummy layout)
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#606060] h-24 rounded-md flex items-center justify-center">Stat/Info 1</div>
        <div className="bg-[#606060] h-24 rounded-md flex items-center justify-center">Stat/Info 2</div>
        <div className="bg-[#606060] h-24 rounded-md flex items-center justify-center">Stat/Info 3</div>
        <div className="bg-[#606060] h-24 rounded-md flex items-center justify-center">Stat/Info 4</div>
      </div>
    </div>
  )
}
