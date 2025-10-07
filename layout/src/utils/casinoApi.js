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

// Fetch games with pagination
export const fetchGames = async (batchNumber = 0, batchSize = 100, providerName = 'all', search = '') => {
  console.log('fetchGames API called with:', { batchNumber, batchSize, providerName, search });
  
  try {
    const params = {
      batchNumber,
      batchSize,
      providerName,
      search
    };
    
    const response = await casinoApi.get('/gap-casino-game/providers/games', { params });
    console.log('fetchGames response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

export default casinoApi;