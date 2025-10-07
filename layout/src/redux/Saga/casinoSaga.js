import { all, call, put, takeEvery } from "redux-saga/effects";
import { fetchProvidersNames, fetchGames } from "../../utils/casinoApi";
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
  FETCH_MORE_CASINO_PROVIDERS_FAILURE
} from "../Action/actionTypes";
import {
  fetchCasinoGamesSuccess,
  fetchCasinoGamesFailure,
  fetchMoreCasinoGamesSuccess,
  fetchMoreCasinoGamesFailure,
  fetchCasinoProvidersSuccess,
  fetchCasinoProvidersFailure,
  fetchMoreCasinoProvidersSuccess,
  fetchMoreCasinoProvidersFailure
} from "../Action/casinoActions";

// Worker saga to fetch casino providers
function* fetchCasinoProvidersRequest(action) {
  console.log('fetchCasinoProvidersRequest saga called with action:', action);
  
  try {
    console.log('Fetching casino providers');
    
    // Make API call to fetch providers names
    const response = yield call(fetchProvidersNames);
    
    console.log('API response for providers:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Extract provider names from the response
      const providersData = response.data.map(providerName => ({
        providerName: providerName
      }));
      
      console.log('Providers data processed:', providersData);
      
      // Dispatch success action with the providers data
      yield put(fetchCasinoProvidersSuccess({
        data: providersData,
        pagination: { hasMore: false } // No more data since we're fetching all at once
      }));
    } else {
      // Dispatch failure action with error message
      const errorMessage = response?.message || "Failed to fetch casino providers";
      console.error('Failed to fetch casino providers:', errorMessage);
      yield put(fetchCasinoProvidersFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch casino providers";
    console.error('Error fetching casino providers:', errorMessage);
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
  console.log('fetchCasinoGamesRequest saga called with action:', action);
  
  try {
    const { batchNumber = 0, batchSize = 100, providerName = 'all', search = '' } = action.payload;
    
    console.log('Fetching casino games with:', { batchNumber, batchSize, providerName, search });
    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    
    console.log('API response for games:', response);
    
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
      console.error('Failed to fetch casino games:', errorMessage);
      yield put(fetchCasinoGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch casino games";
    console.error('Error fetching casino games:', errorMessage);
    yield put(fetchCasinoGamesFailure(errorMessage));
  }
}

// Worker saga to fetch more casino games
function* fetchMoreCasinoGamesRequest(action) {
  console.log('fetchMoreCasinoGamesRequest saga called with action:', action);
  
  try {
    const { batchNumber, batchSize = 100, providerName = 'all', search = '' } = action.payload;
    
    console.log('Fetching more casino games with:', { batchNumber, batchSize, providerName, search });
    
    // Make API call to fetch games with pagination
    const response = yield call(fetchGames, batchNumber, batchSize, providerName, search);
    
    console.log('API response for more games:', response);
    
    // Check if response is successful
    if (response?.status === "success") {
      // Use the hasMore value from the API response
      const hasMore = response.pagination?.hasMore || false;
      // We should use the batchNumber from the request, not the response
      // The response batchNumber is the same as the request batchNumber
      const batchNumberFromResponse = batchNumber;
      
      console.log('More games fetched successfully, hasMore:', hasMore, 'batchNumber:', batchNumberFromResponse);
      
      // Log pagination details from response
      console.log('Response pagination details:', {
        hasMore: response.pagination?.hasMore,
        batchNumber: response.pagination?.batchNumber,
        batchSize: response.pagination?.batchSize,
        providerName: response.pagination?.providerName,
        searchQuery: response.pagination?.searchQuery
      });
      
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
      console.error('Failed to fetch more casino games:', errorMessage);
      yield put(fetchMoreCasinoGamesFailure(errorMessage));
    }
  } catch (error) {
    // Dispatch failure action with error message
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch more casino games";
    console.error('Error fetching more casino games:', errorMessage);
    yield put(fetchMoreCasinoGamesFailure(errorMessage));
  }
}

// Watcher saga to watch for FETCH_CASINO_PROVIDERS action
export function* watchFetchCasinoProviders() {
  console.log('watchFetchCasinoProviders saga started');
  yield takeEvery(FETCH_CASINO_PROVIDERS, fetchCasinoProvidersRequest);
}

// Watcher saga to watch for FETCH_MORE_CASINO_PROVIDERS action
export function* watchFetchMoreCasinoProviders() {
  console.log('watchFetchMoreCasinoProviders saga started');
  yield takeEvery(FETCH_MORE_CASINO_PROVIDERS, fetchMoreCasinoProvidersRequest);
}

// Watcher saga to watch for FETCH_CASINO_GAMES action
export function* watchFetchCasinoGames() {
  console.log('watchFetchCasinoGames saga started');
  yield takeEvery(FETCH_CASINO_GAMES, fetchCasinoGamesRequest);
}

// Watcher saga to watch for FETCH_MORE_CASINO_GAMES action
export function* watchFetchMoreCasinoGames() {
  console.log('watchFetchMoreCasinoGames saga started');
  yield takeEvery(FETCH_MORE_CASINO_GAMES, fetchMoreCasinoGamesRequest);
}

// Root saga
export default function* casinoSaga() {
  console.log('casinoSaga root saga started');
  yield all([
    watchFetchCasinoProviders(), 
    watchFetchMoreCasinoProviders(),
    watchFetchCasinoGames(), 
    watchFetchMoreCasinoGames()
  ]);
}