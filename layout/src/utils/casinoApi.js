import axios from "axios";
import {
  getLocalStorageItem,
  notifyError,
  removeLocalStorageItem,
} from "./Helper";

// Use proxy path to avoid CORS issues in development
const CASINO_PROXY_PATH = '/casino-api';

const casinoApi = axios.create({
  baseURL: CASINO_PROXY_PATH,
  timeout: 15000, // Increase timeout to 15 seconds
});

casinoApi.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log("Casino API Request:", config.method?.toUpperCase(), config.url, config.params);
    
    // Ensure proper headers
    config.headers['Content-Type'] = 'application/json';
    
    const token = getLocalStorageItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Casino API Request Error:", error);
    return Promise.reject(error);
  }
);

casinoApi.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log("Casino API Response:", response.status, response.data);
    if (response?.data?.meta?.status === 401) {
      handleUnauthorized(response.data.meta.message);
      return Promise.reject(
        new Error(response.data.meta.message || "Unauthorized")
      );
    }
    return response;
  },
  (error) => {
    // Log error response for debugging
    console.error("Casino API Error Response:", error.response?.status, error.response?.data, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      notifyError('Request timeout. Please try again.');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network Error - Cannot connect to server');
      notifyError('Cannot connect to casino server. Please check your connection.');
      return Promise.reject(new Error('Cannot connect to casino server. Please check your connection.'));
    }
    
    if (error?.response?.status === 401 || error?.response?.data?.meta?.status === 401) {
      handleUnauthorized("Please login again.");
    }
    
    return Promise.reject(error);
  }
);

function handleUnauthorized(message) {
  notifyError(message);
  removeLocalStorageItem("token");
  removeLocalStorageItem("userData");
  window.location.href = "/";
}

// Fetch providers names
export const fetchProvidersNames = async () => {
  console.log('fetchProvidersNames API called');
  
  try {
    const response = await casinoApi.get('/gap-casino-game/providers/names');
    console.log('fetchProvidersNames response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching providers names:", error);
    throw error;
  }
};

// Keep track of pending requests to prevent duplicates
let pendingRequests = {};

// Fetch games with pagination
export const fetchGames = async (batchNumber = 0, batchSize = 100, providerName = 'all', search = '') => {
  // Create a unique key for this request
  const requestKey = `${batchNumber}-${batchSize}-${providerName}-${search}`;
  
  // If this request is already pending, return the existing promise
  if (pendingRequests[requestKey]) {
    console.log('Duplicate request prevented for:', requestKey);
    return pendingRequests[requestKey];
  }
  
  console.log('fetchGames API called with:', { batchNumber, batchSize, providerName, search });
  
  try {
    const params = {
      batchNumber,
      batchSize,
      providerName,
      search
    };
    
    // Store the promise in pending requests
    pendingRequests[requestKey] = casinoApi.get('/gap-casino-game/providers/games', { params });
    
    const response = await pendingRequests[requestKey];
    console.log('fetchGames response:', response.data);
    
    // Remove from pending requests after completion
    delete pendingRequests[requestKey];
    
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    // Remove from pending requests on error
    delete pendingRequests[requestKey];
    throw error;
  }
};

// Fetch game URL for launching games
export const fetchGameUrl = async (gameId, gameCode) => {
  console.log('fetchGameUrl API called with:', { gameId, gameCode });
  
  try {
    const params = { gameId, gameCode };
    const response = await casinoApi.get('/studio21-game/game-url', { params });
    console.log('fetchGameUrl response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching game URL:", error);
    throw error;
  }
};

export default casinoApi;