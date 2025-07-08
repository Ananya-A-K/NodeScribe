import axios from "axios";
import { auth } from "../config/firebase";

// in production, no localhost so make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to include Firebase token
// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const user = auth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken(true); // Force refresh
                    error.config.headers.Authorization = `Bearer ${token}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    // Redirect to login if refresh fails
                    window.location.href = '/login';
                }
            }
      auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;