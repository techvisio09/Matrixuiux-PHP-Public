import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("gsb_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      // Corrupted/missing localStorage entry — start with an empty cart.
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("gsb_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((p) => p.id !== id)), []);

  const updateQty = useCallback(
    (id, qty) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clear, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
