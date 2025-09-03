import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaGripHorizontal, FaDice, FaStar } from 'react-icons/fa'
import { GiDiamonds, GiFishing } from 'react-icons/gi'
import { CgCardSpades } from "react-icons/cg";
import { BsGrid3X3 } from 'react-icons/bs'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const gameCategories = [
  { id: 'all', label: 'ALL', icon: FaGripHorizontal  },
  { id: 'monti', label: 'MONTI', icon: GiDiamonds },
  { id: 'bighilo', label: 'BIG HILO', icon: CgCardSpades  },
  { id: 'fishing', label: 'FISHING', icon: GiFishing },
  { id: 'dice', label: 'DICE', icon: FaDice },
  { id: 'keno', label: 'KENO', icon: BsGrid3X3 }
]

const gameData = [
  {
    id: 'monti',
    title: 'MONTI',
    image: 'https://cmsbetconstruct.com/content/images/casino/icon3/32d6eb4b162c68987775404fd41f3b72_casinoGameIcon3.webp',
    category: 'monti'
  },
  {
    id: 'bighilo',
    title: 'BIG HILO',
    image: 'https://cmsbetconstruct.com/content/images/casino/icon3/32d6eb4b162c68987775404fd41f3b72_casinoGameIcon3.webp',
    category: 'bighilo'
  },
  {
    id: 'fishing',
    title: 'FISHING',
    image: 'https://cmsbetconstruct.com/content/images/casino/icon3/32d6eb4b162c68987775404fd41f3b72_casinoGameIcon3.webp',
    category: 'fishing'
  },
  {
    id: 'dice',
    title: 'DICE',
    image: 'https://cmsbetconstruct.com/content/images/casino/icon3/32d6eb4b162c68987775404fd41f3b72_casinoGameIcon3.webp',
    category: 'dice'
  },
  {
    id: 'keno',
    title: 'KENO',
    image: 'https://cmsbetconstruct.com/content/images/casino/icon3/32d6eb4b162c68987775404fd41f3b72_casinoGameIcon3.webp',
    category: 'keno'
  }
]

const Games = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGames = gameData.filter(game => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="games-container">
      {/* Game Category Filter Bar */}
      <div className="games-filter-bar">
        {gameCategories.map(category => {
          const IconComponent = category.icon
          return (
            <button
              key={category.id}
              className={`games-filter-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <IconComponent size={16} />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Search Bar */}
      <div className="games-search-container">
        <div className="games-search-wrapper">
          <FiSearch className="games-search-icon" size={18} />
          <input
            type="text"
            className="games-search-input"
            placeholder="GAMES"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="games-grid">
        {filteredGames.map(game => (
          <div key={game.id} className="games-card">
            <LazyLoadImage
              src={game.image}
              alt={game.title}
              className="games-card-image"
              effect="blur"
            />
            <div className="games-card-title">{game.title}</div>
            <div className="games-card-overlay">
              <button className="games-card-play-button">PLAY</button>
            </div>
            <div className="games-card-logo"></div>
            <div className="games-card-star">
              <FaStar size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Games