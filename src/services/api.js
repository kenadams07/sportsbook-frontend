import { API_ENDPOINTS } from '../constants/apiEndpoints';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || '/api';
const ODDS_ADMIN_API_BASE_URL = import.meta.env.VITE_ODDS_ADMIN_API_BASE_URL || 'http://127.0.0.1:3010';
const ADMIN_API_TOKEN = import.meta.env.VITE_ADMIN_API_TOKEN;

// Create axios instances with default configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const adminApiClient = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const oddsAdminApiClient = axios.create({
  baseURL: ODDS_ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApiClient.interceptors.request.use((config) => {
  if (ADMIN_API_TOKEN) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${ADMIN_API_TOKEN}`;
  }
  return config;
});

const externalSportsApiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic axios function with error handling
const axiosApi = async (client, endpoint, options = {}) => {
  try {
    const response = await client.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Generic axios function for POST requests with error handling
const axiosPost = async (client, endpoint, data, options = {}) => {
  try {
    const response = await client.post(endpoint, data, options);
    return response.data;
  } catch (error) {
    console.error('API POST call failed:', error);
    throw error;
  }
};

// Generic axios function for PUT requests with error handling
const axiosPut = async (client, endpoint, data, options = {}) => {
  try {
    const response = await client.put(endpoint, data, options);
    return response.data;
  } catch (error) {
    console.error('API PUT call failed:', error);
    throw error;
  }
};

const axiosPatch = async (client, endpoint, data, options = {}) => {
  try {
    const response = await client.patch(endpoint, data, options);
    return response.data;
  } catch (error) {
    console.error('API PATCH call failed:', error);
    throw error;
  }
};

// Generic axios function for DELETE requests with error handling
const axiosDelete = async (client, endpoint, options = {}) => {
  try {
    const response = await client.delete(endpoint, options);
    return response.data;
  } catch (error) {
    console.error('API DELETE call failed:', error);
    throw error;
  }
};

// Generic axios function for external sports API with error handling
const axiosExternalSportsApi = async (endpoint, options = {}) => {
  try {
    const response = await externalSportsApiClient.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error('External Sports API call failed:', error);
    throw error;
  }
};

// API service functions
export const api = {
  // Sports
  getAllSports: () => axiosExternalSportsApi(API_ENDPOINTS.GET_EXTERNAL_SPORTS),
  getAvailableOddsSports: () => axiosApi(oddsAdminApiClient, '/admin/available-sports'),
  getAdminSportCategories: () => axiosApi(oddsAdminApiClient, '/admin/sport-categories'),
  getAdminSports: () => axiosApi(oddsAdminApiClient, '/admin/sports'),
  addAdminSport: () => axiosPost(oddsAdminApiClient, '/admin/sports', {}),
  addAdminLeagues: (payload) => axiosPost(oddsAdminApiClient, '/admin/leagues', payload),
  updateAdminSportCategorySettings: (categoryKey, payload) => axiosPatch(
    oddsAdminApiClient,
    `/admin/sport-categories/${categoryKey}/settings`,
    payload
  ),
  updateAdminLeagueSettings: (sportKey, payload) => axiosPatch(
    oddsAdminApiClient,
    `/admin/leagues/${sportKey}/settings`,
    payload
  ),
  syncAdminSports: () => axiosPost(oddsAdminApiClient, '/admin/sync/sports', {}),
  configureAdminSport: (sportKey, config) => axiosPost(
    oddsAdminApiClient,
    `/admin/sports/${sportKey}/config`,
    config
  ),
  
  // Events
  getEvents: () => axiosApi(apiClient, API_ENDPOINTS.GET_EVENTS),
  getAdminEvents: (params = {}) => axiosApi(oddsAdminApiClient, '/admin/events', { params }),
  syncAdminEvents: (sportKey) => axiosPost(
    oddsAdminApiClient,
    sportKey ? `/admin/sync/events/${sportKey}` : '/admin/sync/events',
    {}
  ),
  restoreAdminEvents: (payload) => axiosPost(oddsAdminApiClient, '/admin/events/restore', payload),
  discoverAdminEventMarkets: (eventId) => axiosApi(oddsAdminApiClient, `/admin/events/${eventId}/markets`),
  updateAdminEventStatus: (eventId, status) => axiosPatch(
    oddsAdminApiClient,
    `/admin/events/${eventId}/status`,
    { status }
  ),
  releaseAdminEventStatus: (eventId) => axiosPatch(
    oddsAdminApiClient,
    `/admin/events/${eventId}/status-control`,
    { statusSource: 'SYSTEM' }
  ),
  updateAdminMarketStatus: (marketDbId, status) => axiosPatch(
    oddsAdminApiClient,
    `/admin/markets/${marketDbId}/status`,
    { status }
  ),
  updateAdminOutcomeStatus: (outcomeId, payload) => axiosPatch(
    oddsAdminApiClient,
    `/admin/outcomes/${outcomeId}/status`,
    payload
  ),
  getEvent: (id) => axiosApi(apiClient, API_ENDPOINTS.GET_EVENT_BY_ID(id)),
  createEvent: (event) => axiosPost(adminApiClient, API_ENDPOINTS.CREATE_EVENT, event),
  updateEvent: (id, event) => axiosPut(apiClient, API_ENDPOINTS.UPDATE_EVENT(id), event),
  deleteEvent: (id) => axiosDelete(apiClient, API_ENDPOINTS.DELETE_EVENT(id)),
  
  // Competitions - This should use adminApiClient since it's calling the admin backend
  getCompetitions: (sportId) => axiosApi(adminApiClient, `${API_ENDPOINTS.GET_COMPETITIONS}?sport_id=${sportId}`),
  
  // Users
  getUsers: () => axiosApi(apiClient, API_ENDPOINTS.GET_USERS),
  getUser: (id) => axiosApi(apiClient, API_ENDPOINTS.GET_USER_BY_ID(id)),
  updateUser: (id, user) => axiosPut(apiClient, API_ENDPOINTS.UPDATE_USER(id), user),
  getAdminUsers: () => axiosApi(adminApiClient, API_ENDPOINTS.GET_ADMIN_USERS),
  addUserBalance: (userId, amount) => axiosPost(adminApiClient, API_ENDPOINTS.ADD_USER_BALANCE, { userId, amount }),
  withdrawUserBalance: (userId, amount) => axiosPost(adminApiClient, API_ENDPOINTS.WITHDRAW_USER_BALANCE, { userId, amount }),
  updateUserPassword: (userId, newPassword) => axiosPost(adminApiClient, API_ENDPOINTS.UPDATE_USER_PASSWORD, { userId, newPassword }),
  fetchUserMarketReports: (userId) => axiosPost(adminApiClient, API_ENDPOINTS.FETCH_USER_MARKET_REPORTS, { userId }),
  
  // Bets
  getBets: () => axiosApi(apiClient, API_ENDPOINTS.GET_BETS),
  getBet: (id) => axiosApi(apiClient, API_ENDPOINTS.GET_BET_BY_ID(id)),
};
