import { http } from "./http.js";

// Public: submit a bulk-order enquiry.
export const submit = (payload) => http.post("/bulk-orders", payload);
