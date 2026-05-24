import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

const initialItems = [
  {
    id: 1,
    name: "Premium Business Cards",
    variant: 'Standard 3.5×2" · Matte · 250 cards',
    unitPrice: 800,
    qty: 1,
    imgColor: "bg-blue-50",
    accent: "#1a56db",
    badge: "🔥 Trending",
    link: "/business-cards",
  },
  {
    id: 2,
    name: "Full-color Flyers A5",
    variant: "A5 · Glossy · 500 flyers",
    unitPrice: 1398,
    qty: 2,
    imgColor: "bg-red-50",
    accent: "#ef4444",
    badge: "⭐ Popular",
    link: "/",
  },
];

export function CartProvider({ children }) {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id, delta) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, updateQty, removeItem, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
