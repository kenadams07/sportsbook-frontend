import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCasinoGames, 
  fetchCasinoProviders,
  fetchMoreCasinoGames,
  resetCasinoGames
} from '../redux/Action/casinoActions';
import CasinoGameCard from './CasinoGameCard';

const CasinoProvidersGamesSection = ({ onProviderSearch, onGameSearch }) => {
  
  const dispatch = useDispatch();
  const { 
    gamesByProvider, 
    loadingGames, 
    loadingMoreGames,
    gamesError,
    providers,
    loadingProviders,
    providersError,
    pagination
  } = useSelector(state => state.CasinoGames);
  
  const [providerSearchQuery, setProviderSearchQuery] = useState("");
  const [gameSearchQuery, setGameSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Ref for the games container
  const gamesContainerRef = useRef(null);

  // Initial fetch for both providers and games
  useEffect(() => {
    // Fetch casino providers when component mounts
    dispatch(fetchCasinoProviders());
    
    // Fetch casino games when component mounts
    dispatch(fetchCasinoGames({ 
      batchNumber: 0, 
      batchSize: 50, 
      providerName: 'all', 
      search: '' 
    }));
  }, [dispatch]);

  // Simple scroll handler
  const handleScroll = useCallback(() => {
    const gamesContainer = gamesContainerRef.current;
    if (!gamesContainer) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = gamesContainer;
    // Simple threshold for detecting near bottom
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

    // Simple check for loading more games - ONLY check the essential conditions
    if (isNearBottom && !loadingMoreGames && pagination.hasMore) {
      dispatch(fetchMoreCasinoGames({
        batchNumber: pagination.batchNumber + 1,
        batchSize: 50,
        providerName: selectedProvider || 'all',
        search: gameSearchQuery
      }));
    }
  }, [dispatch, loadingMoreGames, pagination, selectedProvider, gameSearchQuery]);

  // Add scroll event listener
  useEffect(() => {
    const gamesContainer = gamesContainerRef.current;
    
    if (gamesContainer) {
      // Remove any existing listener first
      gamesContainer.removeEventListener('scroll', handleScroll);
      // Add the scroll listener
      gamesContainer.addEventListener('scroll', handleScroll);
      
      // Also manually call handleScroll once to check initial state
      handleScroll();
      
      return () => {
        gamesContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);
  
  // Periodic check to see if we need to load more data
  // This helps when the container isn't scrollable initially but might become scrollable
  useEffect(() => {
    // Only run this check if we have more data and we're not already loading
    if (loadingMoreGames || !pagination.hasMore) return;
    
    const timer = setTimeout(() => {
      const gamesContainer = gamesContainerRef.current;
      if (!gamesContainer) return;
      
      // Check if container is scrollable
      const isScrollable = gamesContainer.scrollHeight > gamesContainer.clientHeight;
      const { scrollTop, scrollHeight, clientHeight } = gamesContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      // If not scrollable or near bottom and we have more data, try to load more
      if ((isNearBottom || !isScrollable) && pagination.hasMore) {
        const totalGames = gamesByProvider.reduce((total, provider) => total + (provider.games?.length || 0), 0);
        
        // If we have some games, try loading more
        if (totalGames > 0) {
          dispatch(fetchMoreCasinoGames({
            batchNumber: pagination.batchNumber + 1,
            batchSize: 50,
            providerName: selectedProvider || 'all',
            search: gameSearchQuery
          }));
        }
      }
    }, 500); // Check after a short delay to allow rendering
    
    return () => clearTimeout(timer);
  }, [loadingMoreGames, pagination, dispatch, selectedProvider, gameSearchQuery]);

  // Log when component updates
  useEffect(() => {
    const gamesContainer = gamesContainerRef.current;
    if (gamesContainer) {
      // Check if scrollable
      const isScrollable = gamesContainer.scrollHeight > gamesContainer.clientHeight;
      
      if (!isScrollable) {
        // If not scrollable, check if we have enough games to make it scrollable
        const totalGames = gamesByProvider.reduce((total, provider) => total + (provider.games?.length || 0), 0);
        if (totalGames > 0 && pagination.hasMore) {
        }
      }
    }
  }, [gamesByProvider, pagination]);

  // Log when providers change
  useEffect(() => {
    console.log('Providers changed:', providers);
  }, [providers]);

  // Log when pagination changes
  useEffect(() => {
    console.log('Pagination updated:', pagination);
    const gamesContainer = gamesContainerRef.current;
    if (gamesContainer) {
      console.log('Games container dimensions after pagination update:', {
        scrollHeight: gamesContainer.scrollHeight,
        clientHeight: gamesContainer.clientHeight,
        scrollTop: gamesContainer.scrollTop,
        offsetHeight: gamesContainer.offsetHeight
      });
      
      // Check if scrollable
      const isScrollable = gamesContainer.scrollHeight > gamesContainer.clientHeight;
      console.log('Container scrollable check after pagination update:', {
        isScrollable,
        scrollHeight: gamesContainer.scrollHeight,
        clientHeight: gamesContainer.clientHeight,
        difference: gamesContainer.scrollHeight - gamesContainer.clientHeight
      });
      
      if (isScrollable) {
        console.log('Container is scrollable after pagination update');
      } else {
        console.log('Container is NOT scrollable after pagination update');
      }
    }
  }, [pagination]);

  // Log when loading states change
  useEffect(() => {
    console.log('Loading states changed:', { loadingGames, loadingMoreGames, loadingProviders });
  }, [loadingGames, loadingMoreGames, loadingProviders]);

  // Log when error states change
  useEffect(() => {
    console.log('Error states changed:', { gamesError, providersError });
  }, [gamesError, providersError]);

  // Log when selected provider changes
  useEffect(() => {
    console.log('Selected provider changed:', selectedProvider);
  }, [selectedProvider]);

  // Log when search queries change
  useEffect(() => {
    console.log('Search queries changed:', { providerSearchQuery, gameSearchQuery });
  }, [providerSearchQuery, gameSearchQuery]);

  const handleProviderSearch = (e) => {
    const value = e.target.value;
    setProviderSearchQuery(value);
    if (onProviderSearch) {
      onProviderSearch(value);
    }
  };

  const handleGameSearch = (e) => {
    const value = e.target.value;
    setGameSearchQuery(value);
    if (onGameSearch) {
      onGameSearch(value);
    }
  };

  const handleProviderSearchSubmit = () => {
    if (onProviderSearch) {
      onProviderSearch(providerSearchQuery);
    }
  };

  const handleGameSearchSubmit = () => {
    console.log('Game search submitted:', gameSearchQuery);
    
    if (onGameSearch) {
      onGameSearch(gameSearchQuery);
    }
    
    // Reset games and fetch with new search term
    console.log('Resetting casino games for search');
    dispatch(resetCasinoGames());
    
    console.log('Fetching casino games with search term:', gameSearchQuery);
    dispatch(fetchCasinoGames({ 
      batchNumber: 0, 
      batchSize: 100, 
      providerName: selectedProvider || 'all', 
      search: gameSearchQuery 
    }));
  };

  const handleProviderSelect = (providerName) => {
    console.log('Provider selected:', providerName);
    
    // If "All" is clicked (null) or the same provider is clicked again, deselect it
    const newProvider = selectedProvider === providerName ? null : providerName;
    setSelectedProvider(newProvider);
    
    console.log('New provider:', newProvider);
    
    // Reset games and fetch for selected provider
    console.log('Resetting casino games');
    dispatch(resetCasinoGames());
    
    console.log('Fetching casino games for provider:', newProvider || 'all');
    dispatch(fetchCasinoGames({ 
      batchNumber: 0, 
      batchSize: 100, 
      providerName: newProvider || 'all', 
      search: gameSearchQuery 
    }));
  };

  const handlePlayGame = (game) => {
    // Handle game play action
    console.log('Playing game:', game);
    // You can add navigation or game launching logic here
  };

  // Filter providers based on search query (independent of game search)
  const filteredProviders = providers.filter(provider => 
    provider.providerName.toLowerCase().includes(providerSearchQuery.toLowerCase())
  );

  // Filter games by provider when a provider is selected
  // Game search is independent and applies across all games
  const filteredGamesByProvider = selectedProvider 
    ? gamesByProvider
        .filter(provider => provider.providerName === selectedProvider)
        .map(provider => ({
          ...provider,
          games: provider.games.filter(game => 
            // When game search is active, apply game filter across all games
            gameSearchQuery 
              ? game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
              : true
          )
        }))
    : gamesByProvider
        .map(provider => ({
          ...provider,
          games: provider.games.filter(game => 
            // When game search is active, apply game filter across all games
            gameSearchQuery 
              ? game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
              : true
          )
        }))
        .filter(provider => 
          // Only show providers that have games after filtering
          provider.games.length > 0 && 
          // Also filter providers by provider search if active
          provider.providerName.toLowerCase().includes(providerSearchQuery.toLowerCase())
        );

  console.log('CasinoProvidersGamesSection rendering with state:', {
    gamesByProvider,
    loadingGames,
    loadingMoreGames,
    gamesError,
    providers,
    loadingProviders,
    providersError,
    pagination
  });
  console.log('Selected provider:', selectedProvider);
  console.log('Game search query:', gameSearchQuery);
  console.log('Provider search query:', providerSearchQuery);
  console.log('Filtered games by provider:', filteredGamesByProvider);
  console.log('Filtered providers:', filteredProviders);
  console.log('Provider filtering logic:', {
    selectedProvider,
    hasSelectedProvider: !!selectedProvider,
    filteredProvidersCount: selectedProvider 
      ? gamesByProvider.filter(provider => provider.providerName === selectedProvider).length
      : gamesByProvider.length
  });

  return (
    <div className="casino-main-sections-container">
      {/* Section Headers */}
      <div className="casino-section-headers">
        <div className="casino-section-header casino-providers-header">PROVIDERS</div>
        <div className="casino-section-header">GAMES</div>
      </div>
      
      {/* Search Inputs - Always visible */}
      <div className="casino-search-container">
        {/* Provider Search */}
        <div className="casino-provider-search-container">
          <input
            type="text"
            placeholder="Provider Search"
            className="casino-search-input"
            value={providerSearchQuery}
            onChange={handleProviderSearch}
            onKeyPress={(e) => e.key === 'Enter' && handleProviderSearchSubmit()}
          />
          <button className="casino-search-button" onClick={handleProviderSearchSubmit}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Game Search with Filter */}
        <div className="casino-game-search-container">
          <div className="casino-game-search-input-container">
            <input
              type="text"
              placeholder="Game Search"
              className="casino-game-search-input"
              value={gameSearchQuery}
              onChange={handleGameSearch}
              onKeyPress={(e) => e.key === 'Enter' && handleGameSearchSubmit()}
            />
            <button className="casino-game-search-button" onClick={handleGameSearchSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Filter Button */}
          <button className="casino-filter-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        
        {/* Scroll to Bottom Button - aligned horizontally with search inputs */}
        <button 
          onClick={() => {
            const gamesContainer = gamesContainerRef.current;
            if (gamesContainer) {
              gamesContainer.scrollTop = gamesContainer.scrollHeight;
              console.log('Scrolled to bottom');
            }
          }}
          className="casino-scroll-to-bottom-button"
        >
          Scroll to Bottom
        </button>
      </div>

      {/* Providers and Games Display */}
      <div className="casino-content-container">
        {/* Providers List */}
        <div className="casino-providers-list">
          {/* All option - shows all games when selected */}
          <div 
            className={`casino-provider-item ${selectedProvider === null ? 'selected' : ''}`}
            onClick={() => handleProviderSelect(null)}
          >
            All
          </div>
          
          {providersError ? (
            <div className="casino-error-message">
              Error loading providers: {providersError}
              <button 
                className="casino-retry-button" 
                onClick={() => {
                  console.log('Retry button clicked for providers');
                  dispatch(fetchCasinoProviders());
                }}
              >
                Retry
              </button>
            </div>
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((provider, index) => (
              <div 
                key={index}
                className={`casino-provider-item ${selectedProvider === provider.providerName ? 'selected' : ''}`}
                onClick={() => handleProviderSelect(provider.providerName)}
              >
                {provider.providerName}
              </div>
            ))
          ) : (
            !loadingProviders && <div className="casino-no-data">No providers found</div>
          )}
        </div>

        {/* Games Display */}
        <div 
          className="casino-games-display" 
          ref={(el) => {
            gamesContainerRef.current = el;
            if (el) {
              console.log('Games container ref set:', el);
              // Log dimensions when ref is set
              console.log('Initial container dimensions:', {
                scrollHeight: el.scrollHeight,
                clientHeight: el.clientHeight,
                scrollTop: el.scrollTop
              });
            }
          }}
          onScroll={() => {
            // Direct scroll handler for testing
            console.log('Direct scroll event detected');
          }}
        >
          {/* Manual trigger button for testing */}

          
          {gamesError ? (
            <div className="casino-error-message">
              Error loading games: {gamesError}
              <button 
                className="casino-retry-button" 
                onClick={() => {
                  console.log('Retry button clicked for games');
                  dispatch(resetCasinoGames());
                  dispatch(fetchCasinoGames({ 
                    batchNumber: 0, 
                    batchSize: 100, 
                    providerName: selectedProvider || 'all', 
                    search: gameSearchQuery 
                  }));
                }}
              >
                Retry
              </button>
            </div>
          ) : (loadingGames && gamesByProvider.length === 0) || (loadingProviders && providers.length === 0) ? (
            <div className="casino-loading">Loading casino data...</div>
          ) : selectedProvider !== null ? (
            <>
              <h2 className="casino-provider-heading">{selectedProvider === null ? 'All' : selectedProvider} Games</h2>
              {selectedProvider === null ? (
                // Show all games when "All" is selected
                <div className="casino-all-games">
                  {filteredGamesByProvider.length > 0 ? (
                    filteredGamesByProvider.map((provider, providerIndex) => (
                      <div key={providerIndex} className="casino-provider-section">
                        <h2 className="casino-provider-heading">{provider.providerName}</h2>
                        <div className="casino-games-grid">
                          {provider.games.map((game, gameIndex) => (
                            <CasinoGameCard 
                              key={`${provider.providerName}-${game.gameId}-${gameIndex}`}
                              game={game}
                              onPlay={handlePlayGame}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="casino-no-games">No games found</div>
                  )}
                  {loadingMoreGames && (
                    <div className="casino-loading-more">Loading more games...</div>
                  )}
                </div>
              ) : (
                // Show games for a specific provider
                filteredGamesByProvider.length > 0 && filteredGamesByProvider[0].games.length > 0 ? (
                  <div className="casino-games-grid">
                    {filteredGamesByProvider[0].games.map((game, index) => (
                      <CasinoGameCard 
                        key={`${game.providerName}-${game.gameId}-${index}`}
                        game={game}
                        onPlay={handlePlayGame}
                      />
                    ))}
                    {loadingMoreGames && (
                      <div className="casino-loading-more">Loading more games...</div>
                    )}
                  </div>
                ) : (
                  <div className="casino-no-games">No games found</div>
                )
              )}
            </>
          ) : (
            // Display all providers with their games when no provider is selected (initial view)
            <div className="casino-all-games">
              {filteredGamesByProvider.length > 0 ? (
                filteredGamesByProvider.map((provider, providerIndex) => (
                  <div key={providerIndex} className="casino-provider-section">
                    <h2 className="casino-provider-heading">{provider.providerName}</h2>
                    <div className="casino-games-grid">
                      {provider.games.map((game, gameIndex) => (
                        <CasinoGameCard 
                          key={`${provider.providerName}-${game.gameId}-${gameIndex}`}
                          game={game}
                          onPlay={handlePlayGame}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="casino-no-games">No games found</div>
              )}
              {loadingMoreGames && (
                <div className="casino-loading-more">Loading more games...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CasinoProvidersGamesSection;

console.log('CasinoProvidersGamesSection exported');
