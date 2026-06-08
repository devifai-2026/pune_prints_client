import { http, tokenStore } from "./http.js";

export async function register(payload) {
  const data = await http.post("/auth/register", payload);
  tokenStore.set(data.accessToken);
  return data.user;
}

export async function login(payload) {
  const data = await http.post("/auth/login", payload);
  tokenStore.set(data.accessToken);
  return data.user;
}

// Phone auth — step 0. Is this number already registered? { phone, exists }.
export async function lookupPhone(phone) {
  return http.post("/auth/otp/lookup", { phone });
}

// Phone auth — step 1. Sends a (mock) OTP. New numbers must include first/last
// name. Returns { phone, isNewUser, devCode }. Throws with code NEEDS_NAME
// (details.needsName) if a new number is missing its name.
export async function requestOtp({ phone, firstName = "", lastName = "" }) {
  return http.post("/auth/otp/request", { phone, firstName, lastName });
}

// Phone auth — step 2. Verifies the code and starts the session.
export async function verifyOtp({ phone, code }) {
  const data = await http.post("/auth/otp/verify", { phone, code });
  tokenStore.set(data.accessToken);
  return data.user;
}

export async function logout() {
  try { await http.post("/auth/logout"); } finally { tokenStore.set(null); }
}

// Used on app boot to restore the session. Succeeds silently if refresh works.
export async function bootstrapSession() {
  try {
    const data = await http.post("/auth/refresh");
    tokenStore.set(data.accessToken);
    return data.user;
  } catch {
    tokenStore.set(null);
    return null;
  }
}

export async function me() {
  const data = await http.get("/auth/me");
  return data.user;
}
