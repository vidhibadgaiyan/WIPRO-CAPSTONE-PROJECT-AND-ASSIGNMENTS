// src/context/CartContext.jsx
import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add item to cart — if already exists, increment quantity
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Decrement quantity by 1 — remove from cart only when quantity hits 0
  const removeFromCart = (id) => {
    setCart((prev) => {
      return prev
        .map((c) => c.id === id ? { ...c, quantity: c.quantity - 1 } : c)
        .filter((c) => c.quantity > 0);
    });
  };

  // Remove item from cart entirely (used by Cart page Remove button)
  const removeFromCartEntirely = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  // Update quantity directly (used by Cart page input)
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity } : c))
    );
  };

  // Clear entire cart after order placed
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, removeFromCartEntirely, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}