// src/services/orderService.js
import axios from "axios";
import "./axiosConfig"; // attaches Bearer token to every request
 
const ORDER_API = "http://localhost:8084/orders";
 
// ── User ──────────────────────────────────────────────────────────────────────
 
// POST /orders/place
export const placeOrder = (data) =>
  axios.post(`${ORDER_API}/place`, data);
 
// GET /orders/my?email=
export const getMyOrders = (email) =>
  axios.get(`${ORDER_API}/my`, { params: { email } });
 
// GET /orders/{id}/items
export const getOrderItems = (id) =>
  axios.get(`${ORDER_API}/${id}/items`);
 
// GET /orders/{id}/bill  — only works if billGenerated = true
export const getBill = (id) =>
  axios.get(`${ORDER_API}/${id}/bill`);
 
// PUT /orders/{id}/cancel
export const cancelOrder = (id) =>
  axios.put(`${ORDER_API}/${id}/cancel`);
 
// ── Admin ─────────────────────────────────────────────────────────────────────
 
// GET /orders  — all raw orders (admin)
export const getOrders = () =>
  axios.get(ORDER_API);
 
// GET /orders/notifications  — formatted notification cards for admin panel
export const getNotifications = () =>
  axios.get(`${ORDER_API}/notifications`);
 
// PUT /orders/{id}/status?status=PLACED
export const updateOrderStatus = (id, status) =>
  axios.put(`${ORDER_API}/${id}/status`, null, { params: { status } });
 
// PUT /orders/{id}/generateBill
export const generateBill = (id) =>
  axios.put(`${ORDER_API}/${id}/generateBill`);
 
// GET /orders/revenue
export const getRevenue = () =>
  axios.get(`${ORDER_API}/revenue`);