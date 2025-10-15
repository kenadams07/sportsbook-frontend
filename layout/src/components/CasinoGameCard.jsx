import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCasinoGameUrl } from '../redux/Action/casinoActions';

const CasinoGameCard = ({ game, onPlay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handlePlayClick called with game:', game);
    
    if (onPlay) {
      onPlay(game);
    }
    
    // Dispatch action to fetch game URL and open in new tab
    // Check for different possible property names for gameId and gameCode
    const gameId = game.gameId || game.id || game.GameId;
    const gameCode = game.gameCode || game.code || game.GameCode;
    
    console.log('Extracted gameId and gameCode:', { gameId, gameCode });
    
    if (gameId && gameCode) {
      console.log('Dispatching fetchCasinoGameUrl');
      const result = dispatch(fetchCasinoGameUrl({ 
        gameId: gameId, 
        gameCode: gameCode 
      }));
      console.log('Dispatch result:', result);
    } else {
      console.log('Missing gameId or gameCode in game data:', game);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = 'https://placehold.co/300x200/2a2a2a/CCCCCC?text=No+Image';
  };

  return (
    <div className="casino-game-card group" onClick={() => console.log('Game card clicked')}>
      {!imageLoaded && !imageError && (
        <div className="casino-game-card-img-loading">
          <div className="casino-game-card-img-shimmer"></div>
        </div>
      )}
      <img 
        src={imageError ? 'https://placehold.co/300x200/2a2a2a/CCCCCC?text=No+Image' : game.urlThumb} 
        alt={game.name} 
        className={`casino-game-card-img ${imageLoaded ? 'casino-game-card-img-loaded' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
      />
      <div className="casino-game-overlay">
        <h3 className="casino-game-title">{game.name}</h3>
        <button 
          className="casino-play-button" 
          onClick={handlePlayClick}
        >
          Play Now
        </button>
      </div>
      <div className="casino-age-badge">
        +18
      </div>
      <div className="casino-game-name-bottom">
        <p className="casino-game-name-bottom-text">{game.name}</p>
      </div>
    </div>
  );
};

export default CasinoGameCard;