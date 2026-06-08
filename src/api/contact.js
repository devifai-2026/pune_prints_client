import { http } from "./http.js";

export const submit = (payload) => http.post("/contact", payload);
