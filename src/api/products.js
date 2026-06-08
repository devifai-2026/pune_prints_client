import { http } from "./http.js";

export const list = (query = {}) => http.get("/products", { query });
export const detail = (slug) => http.get(`/products/${slug}`);
// Records a share + returns the canonical link: { slug, name, url, shareCount }.
export const share = (slug) => http.post(`/products/${slug}/share`);

// Admin
export const adminList = (query = {}) => http.get("/admin/products", { query });
export const adminCreate = (payload) => http.post("/admin/products", payload);
export const adminUpdate = (id, payload) => http.patch(`/admin/products/${id}`, payload);
export const adminDelete = (id) => http.delete(`/admin/products/${id}`);
