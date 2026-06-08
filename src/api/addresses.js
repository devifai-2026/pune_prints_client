import { http } from "./http.js";

// Personal address book (auth required). Each address has a label
// (Home / Office / Other) and can be picked at checkout.
export const list = () => http.get("/addresses");
export const create = (payload) => http.post("/addresses", payload);
export const update = (id, payload) => http.put(`/addresses/${id}`, payload);
export const setDefault = (id) => http.patch(`/addresses/${id}/default`);
export const remove = (id) => http.delete(`/addresses/${id}`);
