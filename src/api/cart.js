import { http } from "./http.js";

export const get = () => http.get("/cart");
export const addItem = (item) => http.post("/cart/items", item);
export const updateItem = (itemId, qty) => http.patch(`/cart/items/${itemId}`, { qty });
export const removeItem = (itemId) => http.delete(`/cart/items/${itemId}`);
export const clear = () => http.delete("/cart");
