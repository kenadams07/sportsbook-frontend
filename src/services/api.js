import { API_ENDPOINTS } from '../constants/apiEndpoints';
import axios from 'axios';

// Base API configuration using environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || '/api';

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
  
  // Events
  getEvents: () => axiosApi(apiClient, API_ENDPOINTS.GET_EVENTS),
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
  
  // Bets
  getBets: () => axiosApi(apiClient, API_ENDPOINTS.GET_BETS),
  getBet: (id) => axiosApi(apiClient, API_ENDPOINTS.GET_BET_BY_ID(id)),
};