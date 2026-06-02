import { http } from "./http.js";

// Public
export const list = (query = {}) => http.get("/templates", { query });
export const detail = (idOrSlug) => http.get(`/templates/${idOrSlug}`);

// Admin
export const adminList = (query = {}) => http.get("/admin/templates", { query: { ...query, includeDrafts: true } });
export const adminCreate = (payload) => http.post("/admin/templates", payload);
export const adminUpdate = (id, payload) => http.patch(`/admin/templates/${id}`, payload);
export const adminDelete = (id) => http.delete(`/admin/templates/${id}`);
export const adminPublish = (id) => http.post(`/admin/templates/${id}/publish`);
export const adminUnpublish = (id) => http.post(`/admin/templates/${id}/unpublish`);
