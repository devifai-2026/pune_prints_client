import { http } from "./http.js";

export const list = () => http.get("/categories");
export const detail = (idOrSlug) => http.get(`/categories/${idOrSlug}`);
