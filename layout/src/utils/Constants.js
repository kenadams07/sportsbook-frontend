export const PAGINATION = {
  PER_PAGE: 10,
  PAGE: 1,
};

export const BACKEND_API      = import.meta.env.VITE_BACKEND_URL;
export const SOCKET_URL       = import.meta.env.VITE_SOCKET_URL;
export const SECRET_KEY_TOKEN = import.meta.env.VITE_SECRET_KEY_TOKEN;
export const TOKEN_EXPIRES_IN = import.meta.env.VITE_TOKEN_EXPIRES_IN;
export const API_BASE         = import.meta.env.VITE_API_BASE;
export const EVENTS_API_URL   = "https://sportsbookapi.111exch.com/api/v1"; // Primary endpoint
// Backup endpoint: http://89.116.20.218:2700 (used in sportsEventsApi.js as fallback)