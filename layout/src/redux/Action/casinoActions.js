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
} from "./actionTypes";

// Games Actions
export const fetchCasinoGames = (params = {}) => {
  // Removed console.log('fetchCasinoGames action called with params:', params);
  
  return {
    type: FETCH_CASINO_GAMES,
    payload: params,
  };
};

export const fetchCasinoGamesSuccess = (payload) => {
  // Removed console.log('fetchCasinoGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_CASINO_GAMES_SUCCESS,
    payload,
  };
};

export const fetchCasinoGamesFailure = (error) => {
  // Removed console.log('fetchCasinoGamesFailure action called with error:', error);
  
  return {
    type: FETCH_CASINO_GAMES_FAILURE,
    payload: error,
  };
};

export const fetchMoreCasinoGames = (params) => {
  // Removed console.log('fetchMoreCasinoGames action called with params:', params);
  // Add stack trace to see where this is being called from
  // Removed console.trace('fetchMoreCasinoGames call stack');
  
  return {
    type: FETCH_MORE_CASINO_GAMES,
    payload: params,
  };
};

export const fetchMoreCasinoGamesSuccess = (payload) => {
  // Removed console.log('fetchMoreCasinoGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_MORE_CASINO_GAMES_SUCCESS,
    payload,
  };
};

export const fetchMoreCasinoGamesFailure = (error) => {
  // Removed console.log('fetchMoreCasinoGamesFailure action called with error:', error);
  
  return {
    type: FETCH_MORE_CASINO_GAMES_FAILURE,
    payload: error,
  };
};

// Homepage Casino Games Actions (SUNO provider)
export const fetchHomepageCasinoGames = (params = {}) => {
  // Removed console.log('fetchHomepageCasinoGames action called with params:', params);
  
  return {
    type: FETCH_HOMEPAGE_CASINO_GAMES,
    payload: params,
  };
};

export const fetchHomepageCasinoGamesSuccess = (payload) => {
  // Removed console.log('fetchHomepageCasinoGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_HOMEPAGE_CASINO_GAMES_SUCCESS,
    payload,
  };
};

export const fetchHomepageCasinoGamesFailure = (error) => {
  // Removed console.log('fetchHomepageCasinoGamesFailure action called with error:', error);
  
  return {
    type: FETCH_HOMEPAGE_CASINO_GAMES_FAILURE,
    payload: error,
  };
};

// Homepage Live Games Actions (SPRIBE provider)
export const fetchHomepageLiveGames = (params = {}) => {
  // Removed console.log('fetchHomepageLiveGames action called with params:', params);
  
  return {
    type: FETCH_HOMEPAGE_LIVE_GAMES,
    payload: params,
  };
};

export const fetchHomepageLiveGamesSuccess = (payload) => {
  // Removed console.log('fetchHomepageLiveGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_HOMEPAGE_LIVE_GAMES_SUCCESS,
    payload,
  };
};

export const fetchHomepageLiveGamesFailure = (error) => {
  // Removed console.log('fetchHomepageLiveGamesFailure action called with error:', error);
  
  return {
    type: FETCH_HOMEPAGE_LIVE_GAMES_FAILURE,
    payload: error,
  };
};

// Reset games action
export const resetCasinoGames = () => {
  // Removed console.log('resetCasinoGames action called');
  
  return {
    type: RESET_CASINO_GAMES,
  };
};

// Providers Actions
export const fetchCasinoProviders = (params = {}) => {
  // Removed console.log('fetchCasinoProviders action called with params:', params);
  
  return {
    type: FETCH_CASINO_PROVIDERS,
    payload: params,
  };
};

export const fetchCasinoProvidersSuccess = (payload) => {
  // Removed console.log('fetchCasinoProvidersSuccess action called with payload:', payload);
  
  return {
    type: FETCH_CASINO_PROVIDERS_SUCCESS,
    payload,
  };
};

export const fetchCasinoProvidersFailure = (error) => {
  // Removed console.log('fetchCasinoProvidersFailure action called with error:', error);
  
  return {
    type: FETCH_CASINO_PROVIDERS_FAILURE,
    payload: error,
  };
};

export const fetchMoreCasinoProviders = (params) => ({
  type: FETCH_MORE_CASINO_PROVIDERS,
  payload: params,
});

export const fetchMoreCasinoProvidersSuccess = (payload) => ({
  type: FETCH_MORE_CASINO_PROVIDERS_SUCCESS,
  payload,
});

export const fetchMoreCasinoProvidersFailure = (error) => ({
  type: FETCH_MORE_CASINO_PROVIDERS_FAILURE,
  payload: error,
});