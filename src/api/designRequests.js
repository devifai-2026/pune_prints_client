import { http } from "./http.js";

// Public: submit a "Hire a designer" enquiry.
export const submit = (payload) => http.post("/design-requests", payload);
