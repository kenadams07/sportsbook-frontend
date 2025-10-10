import {
  FETCH_CASINO_GAMES,
  FETCH_CASINO_GAMES_SUCCESS,
  FETCH_CASINO_GAMES_FAILURE,
  FETCH_MORE_CASINO_GAMES,
  FETCH_MORE_CASINO_GAMES_SUCCESS,
  FETCH_MORE_CASINO_GAMES_FAILURE,
  FETCH_CASINO_PROVIDERS,
  FETCH_CASINO_PROVIDERS_SUCCESS,
  FETCH_CASINO_PROVIDERS_FAILURE,
  FETCH_MORE_CASINO_PROVIDERS,
  FETCH_MORE_CASINO_PROVIDERS_SUCCESS,
  FETCH_MORE_CASINO_PROVIDERS_FAILURE,
  RESET_CASINO_GAMES,
  FETCH_HOMEPAGE_CASINO_GAMES,
  FETCH_HOMEPAGE_CASINO_GAMES_SUCCESS,
  FETCH_HOMEPAGE_CASINO_GAMES_FAILURE,
  FETCH_HOMEPAGE_LIVE_GAMES,
  FETCH_HOMEPAGE_LIVE_GAMES_SUCCESS,
  FETCH_HOMEPAGE_LIVE_GAMES_FAILURE
} from "../Action/actionTypes";

const INIT_STATE = {
  // Games state
  gamesByProvider: [],
  loadingGames: false,
  loadingMoreGames: false,
  gamesError: null,
  
  // Homepage Casino Games state (SUNO provider)
  homepageCasinoGames: [],
  loadingHomepageCasinoGames: false,
  homepageCasinoGamesError: null,
  
  // Homepage Live Games state (SPRIBE provider)
  homepageLiveGames: [],
  loadingHomepageLiveGames: false,
  homepageLiveGamesError: null,
  
  // Providers state
  providers: [],
  loadingProviders: false,
  loadingMoreProviders: false,
  providersError: null,
  
  // Pagination
  pagination: {
    hasMore: true,
    batchNumber: 0,
    batchSize: 50,
    providerName: 'all',
    search: '',
  },
};

const casinoReducer = (state = INIT_STATE, action) => {
  console.log('Casino reducer called with action:', action.type);
  console.log('Current state:', state);
  
  switch (action.type) {
    // Games Actions
    case FETCH_CASINO_GAMES:
      console.log('Fetching casino games action dispatched');
      
      return { 
        ...state, 
        loadingGames: true, 
        gamesError: null,
        gamesByProvider: [], // Reset games when fetching new ones
        pagination: {
          ...state.pagination,
          batchNumber: 0,
          providerName: action.payload.providerName || 'all',
          search: action.payload.search || '',
        }
      };
    case FETCH_CASINO_GAMES_SUCCESS:
      console.log('Casino games fetched successfully:', { 
        data: action.payload.data || action.payload,
        pagination: action.payload.pagination
      });
      
      // Log the pagination update
      const updatedPaginationForInitial = action.payload.pagination 
        ? { 
            ...state.pagination, 
            ...action.payload.pagination
          }
        : state.pagination;
      
      console.log('Updated pagination for initial fetch:', updatedPaginationForInitial);
      
      return {
        ...state,
        loadingGames: false,
        gamesByProvider: action.payload.data || action.payload,
        pagination: updatedPaginationForInitial,
        gamesError: null,
      };
    case FETCH_CASINO_GAMES_FAILURE:
      return { 
        ...state, 
        loadingGames: false, 
        gamesError: action.payload,
        gamesByProvider: [],
      };
    case FETCH_MORE_CASINO_GAMES:
      console.log('Fetching more casino games action dispatched');
      
      return { 
        ...state, 
        loadingMoreGames: true, 
        gamesError: null 
      };
    case FETCH_MORE_CASINO_GAMES_SUCCESS:
      // Group games by provider
      const newGamesByProvider = action.payload.data || action.payload;
      const mergedGamesByProvider = [...state.gamesByProvider];
      
      console.log('Merging new games with existing games:', { 
        newGamesByProvider, 
        existingGames: state.gamesByProvider,
        pagination: action.payload.pagination
      });
      
      // Log pagination update
      console.log('Updating pagination with:', action.payload.pagination);
      console.log('Current pagination state:', state.pagination);
      
      // Merge new games with existing ones by provider
      newGamesByProvider.forEach(newProvider => {
        const existingProviderIndex = mergedGamesByProvider.findIndex(
          p => p.providerName === newProvider.providerName
        );
        
        if (existingProviderIndex >= 0) {
          // Merge games for existing provider
          mergedGamesByProvider[existingProviderIndex] = {
            ...mergedGamesByProvider[existingProviderIndex],
            games: [
              ...mergedGamesByProvider[existingProviderIndex].games,
              ...newProvider.games
            ]
          };
        } else {
          // Add new provider
          mergedGamesByProvider.push(newProvider);
        }
      });
      
      console.log('Merged games by provider:', mergedGamesByProvider);
      
      // Create updated pagination object
      // Use the pagination data from the API response, but increment batchNumber
      const updatedPagination = action.payload.pagination 
        ? { 
            ...state.pagination, 
            ...action.payload.pagination,
            batchNumber: state.pagination.batchNumber + 1
          }
        : { 
            ...state.pagination,
            batchNumber: state.pagination.batchNumber + 1
          };
      
      console.log('Updated pagination:', updatedPagination);
      
      return {
        ...state,
        loadingMoreGames: false,
        gamesByProvider: mergedGamesByProvider,
        pagination: updatedPagination,
        gamesError: null,
      };
    case FETCH_MORE_CASINO_GAMES_FAILURE:
      return { 
        ...state, 
        loadingMoreGames: false, 
        gamesError: action.payload,
      };
    case RESET_CASINO_GAMES:
      console.log('Resetting casino games');
      
      return {
        ...state,
        gamesByProvider: [],
        pagination: {
          ...state.pagination,
          batchNumber: 0,
          search: '',
        }
      };
      
    // Homepage Casino Games Actions (SUNO provider)
    case FETCH_HOMEPAGE_CASINO_GAMES:
      console.log('Fetching homepage casino games action dispatched');
      
      return { 
        ...state, 
        loadingHomepageCasinoGames: true, 
        homepageCasinoGamesError: null
      };
    case FETCH_HOMEPAGE_CASINO_GAMES_SUCCESS:
      console.log('Homepage casino games fetched successfully:', action.payload);
      
      return {
        ...state,
        loadingHomepageCasinoGames: false,
        homepageCasinoGames: action.payload.data || action.payload,
        homepageCasinoGamesError: null,
      };
    case FETCH_HOMEPAGE_CASINO_GAMES_FAILURE:
      return { 
        ...state, 
        loadingHomepageCasinoGames: false, 
        homepageCasinoGamesError: action.payload,
        homepageCasinoGames: [],
      };
      
    // Homepage Live Games Actions (SPRIBE provider)
    case FETCH_HOMEPAGE_LIVE_GAMES:
      console.log('Fetching homepage live games action dispatched');
      
      return { 
        ...state, 
        loadingHomepageLiveGames: true, 
        homepageLiveGamesError: null
      };
    case FETCH_HOMEPAGE_LIVE_GAMES_SUCCESS:
      console.log('Homepage live games fetched successfully:', action.payload);
      
      return {
        ...state,
        loadingHomepageLiveGames: false,
        homepageLiveGames: action.payload.data || action.payload,
        homepageLiveGamesError: null,
      };
    case FETCH_HOMEPAGE_LIVE_GAMES_FAILURE:
      return { 
        ...state, 
        loadingHomepageLiveGames: false, 
        homepageLiveGamesError: action.payload,
        homepageLiveGames: [],
      };
      
    // Providers Actions
    case FETCH_CASINO_PROVIDERS:
      return { ...state, loadingProviders: true, providersError: null };
    case FETCH_CASINO_PROVIDERS_SUCCESS:
      console.log('Casino providers fetched successfully:', { 
        data: action.payload.data || action.payload,
        pagination: action.payload.pagination
      });
      
      return {
        ...state,
        loadingProviders: false,
        providers: action.payload.data || action.payload,
        pagination: action.payload.pagination 
          ? action.payload.pagination 
          : state.pagination,
        providersError: null,
      };
    case FETCH_CASINO_PROVIDERS_FAILURE:
      return { 
        ...state, 
        loadingProviders: false, 
        providersError: action.payload,
        providers: [],
      };
    case FETCH_MORE_CASINO_PROVIDERS:
      return { 
        ...state, 
        loadingMoreProviders: true, 
        providersError: null 
      };
    case FETCH_MORE_CASINO_PROVIDERS_SUCCESS:
      return {
        ...state,
        loadingMoreProviders: false,
        providers: [...state.providers, ...(action.payload.data || action.payload)],
        pagination: action.payload.pagination 
          ? { ...state.pagination, ...action.payload.pagination }
          : state.pagination,
        providersError: null,
      };
    case FETCH_MORE_CASINO_PROVIDERS_FAILURE:
      return { 
        ...state, 
        loadingMoreProviders: false, 
        providersError: action.payload,
      };
      
    default:
      return state;
  }
};

export default casinoReducer;