import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCasinoGames } from '../redux/Action/casinoActions'
import { FiSearch } from 'react-icons/fi'
import CasinoGameCard from './CasinoGameCard'

const Games = () => {
  const dispatch = useDispatch()
  const { gamesByProvider, loadingGames, gamesError } = useSelector(state => state.CasinoGames)
  
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch games data from API using Redux
  useEffect(() => {
    // Fetch casino games with SPRIBE provider
    dispatch(fetchCasinoGames({ 
      batchNumber: 0, 
      batchSize: 100, 
      providerName: 'SPRIBE', 
      search: '' 
    }))
  }, [dispatch])

  // Flatten games from all providers for display
  const allGames = gamesByProvider.flatMap(provider => provider.games || [])

  // Filter games based on search term only (no category filtering)
  const filteredGames = allGames.filter(game => {
    return game.name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handlePlayGame = (game) => {
    // Handle game play action
    console.log('Playing game:', game)
    // You can add navigation or game launching logic here
  }

  if (loadingGames && allGames.length === 0) {
    return (
      <div className="games-container">
        {/* Search Bar */}
        <div className="games-search-container">
          <div className="games-search-wrapper">
            <FiSearch className="games-search-icon" size={18} />
            <input
              type="text"
              className="games-search-input"
              placeholder="Search Games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="games-grid" style={{ gap: '0.5rem' }}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="casino-game-card">
              <div className="casino-game-card-img-loading">
                <div className="casino-game-card-img-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (gamesError) {
    return (
      <div className="games-container">
        {/* Search Bar */}
        <div className="games-search-container">
          <div className="games-search-wrapper">
            <FiSearch className="games-search-icon" size={18} />
            <input
              type="text"
              className="games-search-input"
              placeholder="Search Games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="games-error">
          Error loading games: {gamesError}
          <button onClick={() => window.location.reload()} className="games-retry-button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="games-container">
      {/* Search Bar */}
      <div className="games-search-container">
        <div className="games-search-wrapper">
          <FiSearch className="games-search-icon" size={18} />
          <input
            type="text"
            className="games-search-input"
            placeholder="Search Games"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-grid" style={{ gap: '0.5rem' }}>
        {filteredGames.map(game => (
          <CasinoGameCard 
            key={game.gameId || game.id}
            game={game}
            onPlay={handlePlayGame}
          />
        ))}
      </div>
    </div>
  )
}

export default Games