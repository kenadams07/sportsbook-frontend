import axios from "axios";
import {
  getLocalStorageItem,
  notifyError,
  removeLocalStorageItem,
} from "./Helper";
import { BACKEND_API } from "./Constants";

const api = axios.create({
  baseURL: BACKEND_API,
  timeout: 10000, // Add a 10 second timeout
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
    console.error("API Error Response:", error.response?.status, error.response?.data, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
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

export default api;