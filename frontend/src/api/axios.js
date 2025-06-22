// frontend/src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://your-backend-api-url.com", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request/response interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Example: Attach JWT token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;