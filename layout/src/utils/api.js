import axios from "axios";
import {
  getLocalStorageItem,
  notifyError,
  removeLocalStorageItem,
} from "./Helper";
import { BACKEND_API } from "./Constants";

const api = axios.create({
  baseURL: BACKEND_API,
});

api.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response?.data?.meta?.status === 401) {
      handleUnauthorized(response.data.meta.message);
      return Promise.reject(
        new Error(response.data.meta.message || "Unauthorized")
      );
    }
    return response;
  },
  (error) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.data?.meta?.status === 401
    ) {
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
