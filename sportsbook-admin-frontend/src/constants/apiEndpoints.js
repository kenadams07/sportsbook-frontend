// API Endpoints Constants
export const API_ENDPOINTS = {
  // Sports endpoints
  GET_ALL_SPORTS: '/sports',
  GET_SPORT_BY_ID: (id) => `/sports/${id}`,
  
  // Events endpoints
  GET_EVENTS: '/events',
  GET_EVENT_BY_ID: (id) => `/events/${id}`,
  CREATE_EVENT: '/events-data/process',
  UPDATE_EVENT: (id) => `/events/${id}`,
  DELETE_EVENT: (id) => `/events/${id}`,
  
  // Competitions endpoints
  GET_COMPETITIONS: '/events-data/competitions/live',
  GET_COMPETITION_BY_ID: (id) => `/events-data/competitions/${id}`,
  
  // Users endpoints
  GET_USERS: '/users',
  GET_USER_BY_ID: (id) => `/users/${id}`,
  UPDATE_USER: (id) => `/users/${id}`,
  
  // Bets endpoints
  GET_BETS: '/bets',
  GET_BET_BY_ID: (id) => `/bets/${id}`,
  
  // External sports API endpoints
  GET_EXTERNAL_SPORTS: '/sports-api/all-sport_id',
  GET_EXTERNAL_EVENTS: '/sports-api/events',
};