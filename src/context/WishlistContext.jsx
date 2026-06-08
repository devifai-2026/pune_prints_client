import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import * as wishlistApi from "../api/wishlist.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(null);

/**
 * Source of truth for the signed-in user's wishlist.
 *
 *   { ids, count, isSaved, toggle, refresh, requiresAuth }
 *
 * `ids` is a Set of product ids for cheap heart-state lookups. Anonymous users
 * have an empty set; toggling while anonymous returns { requiresAuth: true } so
 * callers can redirect to /login.
 */
export function WishlistProvider({ children }) {
  const { status } = useAuth();
  const [ids, setIds] = useState(() => new Set());

  const refresh = useCallback(async () => {
    if (status !== "authenticated") { setIds(new Set()); return; }
    try {
      const list = await wishlistApi.ids();
      setIds(new Set(list));
    } catch {
      /* keep whatever we had */
    }
  }, [status]);

  useEffect(() => { refresh(); }, [refresh]);

  const isSaved = useCallback((productId) => ids.has(productId), [ids]);

  // Optimistic toggle, reconciled with the server response.
  const toggle = useCallback(async (productId) => {
    if (status !== "authenticated") return { requiresAuth: true };
    const next = new Set(ids);
    const wasSaved = next.has(productId);
    if (wasSaved) next.delete(productId); else next.add(productId);
    setIds(next);
    try {
      const res = await wishlistApi.toggle(productId);
      // Reconcile in case server state differed.
      setIds((cur) => {
        const s = new Set(cur);
        if (res?.saved) s.add(productId); else s.delete(productId);
        return s;
      });
      return { saved: res?.saved };
    } catch (err) {
      // Roll back on failure.
      setIds((cur) => {
        const s = new Set(cur);
        if (wasSaved) s.add(productId); else s.delete(productId);
        return s;
      });
      throw err;
    }
  }, [ids, status]);

  const value = useMemo(() => ({
    ids,
    count: ids.size,
    isSaved,
    toggle,
    refresh,
  }), [ids, isSaved, toggle, refresh]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
