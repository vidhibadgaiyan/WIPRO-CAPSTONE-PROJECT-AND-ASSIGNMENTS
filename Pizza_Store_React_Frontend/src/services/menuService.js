// src/services/menuService.js
import axios from "axios";
import "./axiosConfig"; // attaches Bearer token to every request
 
const MENU_API = "http://localhost:8083/menu";
 
export const getMenu = () =>
  axios.get(MENU_API);
 
// Filter: category only, subcategory only, or both
// e.g. getMenuFiltered("Pizza", "Veg")
export const getMenuFiltered = (category, subcategory) => {
  const params = {};
  if (category)    params.category    = category;
  if (subcategory) params.subcategory = subcategory;
  return axios.get(`${MENU_API}/filter`, { params });
};
 
export const addMenuItem = (data) =>
  axios.post(MENU_API, data);
 
export const updateMenuItem = (id, data) =>
  axios.put(`${MENU_API}/${id}`, data);
 
export const deleteMenuItem = (id) =>
  axios.delete(`${MENU_API}/${id}`);