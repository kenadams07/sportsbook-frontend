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
  RESET_CASINO_GAMES
} from "./actionTypes";

// Games Actions
export const fetchCasinoGames = (params = {}) => {
  console.log('fetchCasinoGames action called with params:', params);
  
  return {
    type: FETCH_CASINO_GAMES,
    payload: params,
  };
};

export const fetchCasinoGamesSuccess = (payload) => {
  console.log('fetchCasinoGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_CASINO_GAMES_SUCCESS,
    payload,
  };
};

export const fetchCasinoGamesFailure = (error) => {
  console.log('fetchCasinoGamesFailure action called with error:', error);
  
  return {
    type: FETCH_CASINO_GAMES_FAILURE,
    payload: error,
  };
};

export const fetchMoreCasinoGames = (params) => {
  console.log('fetchMoreCasinoGames action called with params:', params);
  // Add stack trace to see where this is being called from
  console.trace('fetchMoreCasinoGames call stack');
  
  return {
    type: FETCH_MORE_CASINO_GAMES,
    payload: params,
  };
};

export const fetchMoreCasinoGamesSuccess = (payload) => {
  console.log('fetchMoreCasinoGamesSuccess action called with payload:', payload);
  
  return {
    type: FETCH_MORE_CASINO_GAMES_SUCCESS,
    payload,
  };
};

export const fetchMoreCasinoGamesFailure = (error) => {
  console.log('fetchMoreCasinoGamesFailure action called with error:', error);
  
  return {
    type: FETCH_MORE_CASINO_GAMES_FAILURE,
    payload: error,
  };
};

// Reset games action
export const resetCasinoGames = () => {
  console.log('resetCasinoGames action called');
  
  return {
    type: RESET_CASINO_GAMES,
  };
};

// Providers Actions
export const fetchCasinoProviders = (params = {}) => {
  console.log('fetchCasinoProviders action called with params:', params);
  
  return {
    type: FETCH_CASINO_PROVIDERS,
    payload: params,
  };
};

export const fetchCasinoProvidersSuccess = (payload) => {
  console.log('fetchCasinoProvidersSuccess action called with payload:', payload);
  
  return {
    type: FETCH_CASINO_PROVIDERS_SUCCESS,
    payload,
  };
};

export const fetchCasinoProvidersFailure = (error) => {
  console.log('fetchCasinoProvidersFailure action called with error:', error);
  
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