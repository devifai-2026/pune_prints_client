import { http } from "./http.js";

// Public { key: value } content map (includes home_content, global blocks).
export const publicMap = () => http.get("/settings");
