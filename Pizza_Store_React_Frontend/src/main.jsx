// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
 
// Import once here — attaches JWT interceptor to all axios calls globally
import "./services/axiosConfig";
 
import App from "./App";
import { CartProvider } from "./context/CartContext";
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <App />
  </CartProvider>
);
