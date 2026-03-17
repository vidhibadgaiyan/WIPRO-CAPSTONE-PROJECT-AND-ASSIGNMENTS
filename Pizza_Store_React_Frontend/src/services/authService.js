// src/services/authService.js
import axios from "axios";
 
const USER_API  = "http://localhost:8081/auth";
const OWNER_API = "http://localhost:8082/owner/auth";
 
export const register = async (data) => {
  if (data.role === "USER") {
    return axios.post(`${USER_API}/register`, data);
  } else {
    return axios.post(`${OWNER_API}/register`, data);
  }
};
 
export const login = async (data) => {
  let response;
  if (data.role === "USER") {
    response = await axios.post(`${USER_API}/login`, data);
  } else {
    response = await axios.post(`${OWNER_API}/login`, data);
  }
 
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("role",  data.role);
  // Store email so cart and orders pages can use it without asking again
  localStorage.setItem("email", data.email);
 
  return response;
};
 
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};
 
export const getToken = () => localStorage.getItem("token");
export const getRole  = () => localStorage.getItem("role");
export const getEmail = () => localStorage.getItem("email");