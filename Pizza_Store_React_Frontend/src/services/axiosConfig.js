// src/services/axiosConfig.js
// Import this file once in main.jsx — it attaches the JWT token to every
// outgoing axios request automatically so individual service files stay clean.
 
import axios from "axios";
import { getToken } from "./authService";
 
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);