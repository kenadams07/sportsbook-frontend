import axios from "axios";
import {
  getLocalStorageItem,
  notifyError,
  removeLocalStorageItem,
} from "./Helper";
import { BACKEND_API } from "./Constants";
import { getApiErrorMessage, getApiStatusCode } from "./apiResponse";

// Use proxy endpoint in development to avoid CORS issues
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment ? '' : BACKEND_API;

// Log the environment and base URL for debugging
console.log("Environment:", import.meta.env.MODE);
console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
});

api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log("API Request:", config.method?.toUpperCase(), config.url, config.data);
    const token = getLocalStorageItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log("API Response:", response.status, response.data);
    if (getApiStatusCode(response.data) === 401 && getLocalStorageItem("token")) {
      handleUnauthorized(response.data.message || "Please login again.");
      return Promise.reject(
        new Error(response.data.message || "Unauthorized")
      );
    }
    return response;
  },
  (error) => {
    // Log error response for debugging
    console.error("API Error Response:", error.response?.status, error.response?.data, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Server is taking too long to respond. Please try again.'));
    }
    
    const requestUrl = error?.config?.url || "";
    const isAuthRoute = requestUrl.includes("/users/login") || requestUrl.includes("/users/signup");

    if (
      (error?.response?.status === 401 || getApiStatusCode(error) === 401) &&
      getLocalStorageItem("token") &&
      !isAuthRoute
    ) {
      handleUnauthorized("Please login again.");
    }
    error.message = getApiErrorMessage(error, error.message);
    return Promise.reject(error);
  }
);

function handleUnauthorized(message) {
  notifyError(message);
  removeLocalStorageItem("token");
  removeLocalStorageItem("userData");
  window.location.href = "/";
}

export default api;
