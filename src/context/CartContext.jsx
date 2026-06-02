import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as cartApi from "../api/cart.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

// ── Anonymous cart cache (localStorage) ────────────────────────────────
// When not signed in, we still want the cart to persist across reloads and
// be merge-able into the server cart at login time.
const ANON_KEY = "pp:anon_cart";
const loadAnon = () => {
  try { return JSON.parse(localStorage.getItem(ANON_KEY) || "[]"); }
  catch { return []; }
};
const saveAnon = (items) => {
  try { localStorage.setItem(ANON_KEY, JSON.stringify(items)); } catch { /* quota exceeded etc */ }
};
const clearAnon = () => { try { localStorage.removeItem(ANON_KEY); } catch { /* ignore */ } };

// Server cart items: { id, productName, variant, unitPrice, qty }
// Anon cart items: same shape but id is local (uuid-ish).
const localId = () => Math.random().toString(36).slice(2, 11);

export function CartProvider({ children }) {
  const { user, status } = useAuth();
  const [items, setItems] = useState(() => loadAnon());
  const [loading, setLoading] = useState(false);

  // Helper to normalise a server cart response to our items array shape.
  const fromServer = (cart) =>
    (cart?.items || []).map((it) => ({
      id: it._id || it.id,
      product: it.product,
      productName: it.productName || it.product?.name,
      variant: it.variant || "",
      unitPrice: it.unitPrice,
      qty: it.qty,
      designSnapshot: it.designSnapshot,
    }));

  // When auth state changes, sync cart with server (and merge anon items on first login).
  useEffect(() => {
    let cancelled = false;
    async function sync() {
      if (status === "loading") return;

      if (status === "anonymous") {
        // No server cart available — show whatever's in localStorage.
        setItems(loadAnon());
        return;
      }

      // authenticated → fetch server cart, merge in any anon items, then commit.
      setLoading(true);
      try {
        const serverCart = await cartApi.get();
        const anon = loadAnon();

        // Push anonymous items into the server cart (one POST per item — fine for
        // small carts; would batch if this got hot).
        if (anon.length > 0) {
          for (const it of anon) {
            if (!it.product) continue;          // anon items without a product id can't sync
            try {
              await cartApi.addItem({
                product: it.product,
                variant: it.variant,
                unitPrice: it.unitPrice,
                qty: it.qty,
                designSnapshot: it.designSnapshot,
              });
            } catch { /* server validation rejected — skip */ }
          }
          clearAnon();
          const merged = await cartApi.get();
          if (!cancelled) setItems(fromServer(merged));
        } else {
          if (!cancelled) setItems(fromServer(serverCart));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    sync();
    return () => { cancelled = true; };
  }, [status, user?.id]);

  // ── Mutations ────────────────────────────────────────────────────────
  const addItem = useCallback(async (item) => {
    if (status === "authenticated") {
      const cart = await cartApi.addItem(item);
      setItems(fromServer(cart));
    } else {
      const next = [...loadAnon(), { ...item, id: localId() }];
      saveAnon(next);
      setItems(next);
    }
  }, [status]);

  const updateQty = useCallback(async (id, delta) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const nextQty = Math.max(1, current.qty + delta);
    if (status === "authenticated") {
      const cart = await cartApi.updateItem(id, nextQty);
      setItems(fromServer(cart));
    } else {
      const next = items.map((i) => (i.id === id ? { ...i, qty: nextQty } : i));
      saveAnon(next);
      setItems(next);
    }
  }, [items, status]);

  const removeItem = useCallback(async (id) => {
    if (status === "authenticated") {
      const cart = await cartApi.removeItem(id);
      setItems(fromServer(cart));
    } else {
      const next = items.filter((i) => i.id !== id);
      saveAnon(next);
      setItems(next);
    }
  }, [items, status]);

  const clear = useCallback(async () => {
    if (status === "authenticated") {
      const cart = await cartApi.clear();
      setItems(fromServer(cart));
    } else {
      clearAnon();
      setItems([]);
    }
  }, [status]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  const value = useMemo(() => ({
    items, totalItems, subtotal, loading,
    addItem, updateQty, removeItem, clear,
  }), [items, totalItems, subtotal, loading, addItem, updateQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
