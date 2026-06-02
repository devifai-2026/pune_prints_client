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
