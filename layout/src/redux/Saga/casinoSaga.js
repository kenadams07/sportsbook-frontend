import { all, call, put, takeEvery } from "redux-saga/effects";
import { fetchProvidersNames, fetchGames, fetchGameUrl } from "../../utils/casinoApi";
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
  FETCH_HOMEPAGE_CASINO_GAMES,
  FETCH_HOMEPAGE_CASINO_GAMES_SUCCESS,
  FETCH_HOMEPAGE_CASINO_GAMES_FAILURE,
  FETCH_HOMEPAGE_LIVE_GAMES,
  FETCH_HOMEPAGE_LIVE_GAMES_SUCCESS,
  FETCH_HOMEPAGE_LIVE_GAMES_FAILURE,
  FETCH_CASINO_GAME_URL,
  FETCH_CASINO_GAME_URL_SUCCESS,
  FETCH_CASINO_GAME_URL_FAILURE
} from "../Action/actionTypes";
import {
  fetchCasinoGamesSuccess,
  fetchCasinoGamesFailure,
  fetchMoreCasinoGamesSuccess,
  fetchMoreCasinoGamesFailure,
  fetchCasinoProvidersSuccess,
  fetchCasinoProvidersFailure,
  fetchMoreCasinoProvidersSuccess,
  fetchMoreCasinoProvidersFailure,
  fetchHomepageCasinoGamesSuccess,
  fetchHomepageCasinoGamesFailure,
  fetchHomepageLiveGamesSuccess,
  fetchHomepageLiveGamesFailure,
  fetchCasinoGameUrlSuccess,
  fetchCasinoGameUrlFailure
} from "../Action/casinoActions";

// Worker saga to fetch casino providers
function* fetchCasinoProvidersRequest(action) {
  // Removed console.log('fetchCasinoProvidersRequest saga called with action:', action);
  
  try {
    // Removed console.log('Fetching casino providers');
    
    // Make API call to fetch providers names
    const response = yield call(fetchProvidersNames);
    
    // Removed console.log('API response for providers:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Extract provider names from the response
      const providersData = response.data.map(providerName => ({
        providerName: providerName
      }));
      
      // Removed console.log('Providers data processed:', providersData);
      
      // Dispatch success action with the providers data
      yield put(fetchCasinoProvidersSuccess({
        data: providersData,
        pagination: { hasMore: false } // No more data since we're fetching all at once
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch casino providers";
      // Removed console.error('Failed to fetch casino providers:', errorMessage);
      yield put(fetchCasinoProvidersFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch casino providers";
    // Removed console.error('Error fetching casino providers:', errorMessage);
    yield put(fetchCasinoProvidersFailure(errorMessage));
  }
}

// Worker saga to fetch more casino providers (not needed with new approach)
function* fetchMoreCasinoProvidersRequest(action) {
  // With the new endpoint that fetches all providers, we don't need to fetch more
  // But we'll keep this function to avoid breaking the saga structure
  yield put(fetchMoreCasinoProvidersSuccess({
    data: [],
    pagination: { hasMore: false }
  }));
}

// Worker saga to fetch casino games
function* fetchCasinoGamesRequest(action) {
  // Removed console.log('fetchCasinoGamesRequest saga called with action:', action);
  
  try {
    const { batchNumber = 0, batchSize = 50, providerName = 'all', search = '' } = action.payload;
    
    // Removed console.log('Fetching casino games with:', { batchNumber, batchSize, providerName, search });
    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    
    // Removed console.log('API response for games:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Use the hasMore value from the API response if available, otherwise calculate it
      const hasMore = response.pagination?.hasMore !== undefined ? 
        response.pagination.hasMore : 
        response.data.length >= batchSize;
      
      // Dispatch success action with the data
      yield put(fetchCasinoGamesSuccess({
        data: response.data,
        pagination: {
          hasMore: hasMore,
          batchNumber: response.pagination?.batchNumber || batchNumber,
          batchSize: response.pagination?.batchSize || batchSize,
          providerName: response.pagination?.providerName || providerName,
          search: response.pagination?.searchQuery || search
        }
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch casino games";
      // Removed console.error('Failed to fetch casino games:', errorMessage);
      yield put(fetchCasinoGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch casino games";
    // Removed console.error('Error fetching casino games:', errorMessage);
    yield put(fetchCasinoGamesFailure(errorMessage));
  }
}

// Keep track of recent requests to prevent infinite loops
let recentRequests = [];
const MAX_RECENT_REQUESTS = 5;

// Worker saga to fetch more casino games
function* fetchMoreCasinoGamesRequest(action) {
  const { batchNumber, batchSize = 50, providerName = 'all', search = '' } = action.payload;
  
  // Create a unique identifier for this request
  const requestIdentifier = `${batchNumber}-${providerName}-${search}`;
  
  // Check if this request was recently made
  if (recentRequests.includes(requestIdentifier)) {
    console.log('Skipping duplicate request:', requestIdentifier);
    return;
  }
  
  // Add to recent requests
  recentRequests.push(requestIdentifier);
  
  // Keep only the most recent requests
  if (recentRequests.length > MAX_RECENT_REQUESTS) {
    recentRequests.shift();
  }
  
  try {
    // Removed console.log('Fetching more casino games with:', { batchNumber, batchSize, providerName, search });
    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    
    // Removed console.log('API response for more games:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Use the hasMore value from the API response
      const hasMore = response.pagination?.hasMore || false;
      
      // Prevent infinite loading if no more data
      if (!hasMore) {
        console.log('No more data to load, stopping pagination');
        return;
      }
      
      // Removed console.log('More games fetched successfully, hasMore:', hasMore, 'batchNumber:', batchNumber);
      
      // Dispatch success action with the data
      yield put(fetchMoreCasinoGamesSuccess({
        data: response.data,
        pagination: {
          hasMore: hasMore,
          batchNumber: batchNumber, // Use the batchNumber from the request
          batchSize: response.pagination?.batchSize || batchSize,
          providerName: response.pagination?.providerName || providerName,
          search: response.pagination?.searchQuery || search
        }
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch more casino games";
      // Removed console.error('Failed to fetch more casino games:', errorMessage);
      yield put(fetchMoreCasinoGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch more casino games";
    // Removed console.error('Error fetching more casino games:', errorMessage);
    yield put(fetchMoreCasinoGamesFailure(errorMessage));
  }
}

// Worker saga to fetch casino game URL
function* fetchCasinoGameUrlRequest(action) {
  console.log('fetchCasinoGameUrlRequest saga worker called with action:', action);
  
  try {
    const { gameId, gameCode } = action.payload;
    
    console.log('Fetching casino game URL with:', { gameId, gameCode });
    
    // Make API call to fetch game URL
    const response = yield call(fetchGameUrl, gameId, gameCode);
    
    console.log('API response for game URL:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Dispatch success action with the data
      yield put(fetchCasinoGameUrlSuccess(response.data));
      
      // Open the game URL in a new tab
      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      }
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch game URL";
      console.error('Failed to fetch game URL:', errorMessage);
      yield put(fetchCasinoGameUrlFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch game URL";
    console.error('Error fetching game URL:', errorMessage);
    yield put(fetchCasinoGameUrlFailure(errorMessage));
  }
}

// Worker saga to fetch homepage casino games (SUNO provider)
function* fetchHomepageCasinoGamesRequest(action) {

  
  try {
    const { batchNumber = 0, batchSize = 5, providerName = 'STUDIO21', search = '' } = action.payload;
    

    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    

    
    // Check if response is successful
    if (response?.status === "success") {
      // Dispatch success action with the data
      yield put(fetchHomepageCasinoGamesSuccess({
        data: response.data,
        pagination: {
          hasMore: response.pagination?.hasMore || false,
          batchNumber: response.pagination?.batchNumber || batchNumber,
          batchSize: response.pagination?.batchSize || batchSize,
          providerName: response.pagination?.providerName || providerName,
          search: response.pagination?.searchQuery || search
        }
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch homepage casino games";
      // Removed console.error('Failed to fetch homepage casino games:', errorMessage);
      yield put(fetchHomepageCasinoGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch homepage casino games";
    // Removed console.error('Error fetching homepage casino games:', errorMessage);
    yield put(fetchHomepageCasinoGamesFailure(errorMessage));
  }
}

// Worker saga to fetch homepage live games (SPRIBE provider)
function* fetchHomepageLiveGamesRequest(action) {
  // Removed console.log('fetchHomepageLiveGamesRequest saga called with action:', action);
  
  try {
    const { batchNumber = 0, batchSize = 5, providerName = 'SPRIBE', search = '' } = action.payload;
    
    // Removed console.log('Fetching homepage live games with:', { batchNumber, batchSize, providerName, search });
    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    
    // Removed console.log('API response for homepage live games:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Dispatch success action with the data
      yield put(fetchHomepageLiveGamesSuccess({
        data: response.data,
        pagination: {
          hasMore: response.pagination?.hasMore || false,
          batchNumber: response.pagination?.batchNumber || batchNumber,
          batchSize: response.pagination?.batchSize || batchSize,
          providerName: response.pagination?.providerName || providerName,
          search: response.pagination?.searchQuery || search
        }
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch homepage live games";
      // Removed console.error('Failed to fetch homepage live games:', errorMessage);
      yield put(fetchHomepageLiveGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch homepage live games";
    // Removed console.error('Error fetching homepage live games:', errorMessage);
    yield put(fetchHomepageLiveGamesFailure(errorMessage));
  }
}

// Watcher saga to watch for FETCH_CASINO_PROVIDERS action
export function* watchFetchCasinoProviders() {
  // Removed console.log('watchFetchCasinoProviders saga started');
  yield takeEvery(FETCH_CASINO_PROVIDERS, fetchCasinoProvidersRequest);
}

// Watcher saga to watch for FETCH_MORE_CASINO_PROVIDERS action
export function* watchFetchMoreCasinoProviders() {
  // Removed console.log('watchFetchMoreCasinoProviders saga started');
  yield takeEvery(FETCH_MORE_CASINO_PROVIDERS, fetchMoreCasinoProvidersRequest);
}

// Watcher saga to watch for FETCH_CASINO_GAMES action
export function* watchFetchCasinoGames() {
  // Removed console.log('watchFetchCasinoGames saga started');
  yield takeEvery(FETCH_CASINO_GAMES, fetchCasinoGamesRequest);
}

// Watcher saga to watch for FETCH_MORE_CASINO_GAMES action
export function* watchFetchMoreCasinoGames() {
  // Removed console.log('watchFetchMoreCasinoGames saga started');
  yield takeEvery(FETCH_MORE_CASINO_GAMES, fetchMoreCasinoGamesRequest);
}

// Watcher saga to watch for FETCH_HOMEPAGE_CASINO_GAMES action
export function* watchFetchHomepageCasinoGames() {
  // Removed console.log('watchFetchHomepageCasinoGames saga started');
  yield takeEvery(FETCH_HOMEPAGE_CASINO_GAMES, fetchHomepageCasinoGamesRequest);
}

// Watcher saga to watch for FETCH_HOMEPAGE_LIVE_GAMES action
export function* watchFetchHomepageLiveGames() {
  // Removed console.log('watchFetchHomepageLiveGames saga started');
  yield takeEvery(FETCH_HOMEPAGE_LIVE_GAMES, fetchHomepageLiveGamesRequest);
}

// Watcher saga to watch for FETCH_CASINO_GAME_URL action
export function* watchFetchCasinoGameUrl() {
  console.log('watchFetchCasinoGameUrl saga started');
  yield takeEvery(FETCH_CASINO_GAME_URL, fetchCasinoGameUrlRequest);
}

// Root saga
export default function* casinoSaga() {
  console.log('casinoSaga root saga started');
  yield all([
    watchFetchCasinoProviders(), 
    watchFetchMoreCasinoProviders(),
    watchFetchCasinoGames(), 
    watchFetchMoreCasinoGames(),
    watchFetchHomepageCasinoGames(),
    watchFetchHomepageLiveGames(),
    watchFetchCasinoGameUrl()
  ]);
}