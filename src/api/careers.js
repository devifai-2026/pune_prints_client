import { http } from "./http.js";

export const jobs = () => http.get("/careers/jobs");
export const apply = (payload) => http.post("/careers/applications", payload);
