import { http } from "./http.js";

export const checkout = (payload) => http.post("/orders/checkout", payload);
export const myOrders = (query = {}) => http.get("/orders", { query });
export const myOrderDetail = (id) => http.get(`/orders/${id}`);

// Admin
export const adminList = (query = {}) => http.get("/admin/orders", { query });
export const adminSetStatus = (id, status, note) => http.patch(`/admin/orders/${id}/status`, { status, note });
