import React, { useState } from 'react';

const CasinoGameCard = ({ game, onPlay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(game);
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
    <div className="casino-game-card group">
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
        <button className="casino-play-button" onClick={handlePlayClick}>
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