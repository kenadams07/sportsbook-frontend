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
    <div className="casino-game-card group relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-md shadow-lg" onClick={() => console.log('Game card clicked')}>
      {!imageLoaded && !imageError && (
        <div className="casino-game-card-img-loading w-full h-full flex items-center justify-center">
          <div className="casino-game-card-img-shimmer w-full h-full bg-gray-300 animate-pulse"></div>
        </div>
      )}
      <img 
        src={imageError ? 'https://placehold.co/300x400/2a2a2a/CCCCCC?text=No+Image' : game.urlThumb} 
        alt={game.name} 
        className={`casino-game-card-img w-full h-full object-cover rounded-md ${imageLoaded ? 'casino-game-card-img-loaded' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
      />
      <div className="casino-game-overlay absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-3 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <h3 className="casino-game-title text-white text-center font-semibold text-xs sm:text-sm mb-1 sm:mb-2 truncate w-full">{game.name}</h3>
        <button 
          className="casino-play-button bg-yellow-500 text-black font-bold py-1 px-2 sm:py-1 sm:px-3 rounded-md text-xs sm:text-sm" 
          onClick={handlePlayClick}
        >
          Play Now
        </button>
      </div>
      <div className="casino-age-badge absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-500 text-black text-xs sm:text-xs font-bold py-0.5 px-1 sm:py-1 sm:px-2 rounded-md">
        +18
      </div>
      <div className="casino-game-name-bottom absolute bottom-0 left-0 w-full p-1 sm:p-2 bg-black bg-opacity-70">
        <p className="casino-game-name-bottom-text text-white text-xs truncate">{game.name}</p>
      </div>
    </div>
  );
};

export default CasinoGameCard;