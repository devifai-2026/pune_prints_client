import { http } from "./http.js";

// Personal wishlist (auth required).
export const list = () => http.get("/wishlist");          // full product cards
export const ids = () => http.get("/wishlist/ids");       // saved product ids
export const add = (productId) => http.post(`/wishlist/${productId}`);
export const toggle = (productId) => http.put(`/wishlist/${productId}/toggle`);
export const remove = (productId) => http.delete(`/wishlist/${productId}`);
