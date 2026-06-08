// Low-level fetch wrapper. All API modules go through this.
//
//  - Auto-injects Bearer token from tokenStore.
//  - Unwraps { ok, data } envelope; throws ApiError on { ok: false, error }.
//  - On 401, attempts a single silent /auth/refresh and replays the request.
//  - Always sends credentials so refresh cookie flows.

import { API_BASE as BASE } from "./config.js";

// ── Token store ─────────────────────────────────────────────────────────
// In-memory access token (lives for the tab session). The httpOnly refresh
// cookie is the durable part; we never put a long-lived token in localStorage.
let accessToken = null;
let onAuthChange = null;
let refreshInFlight = null;

export const tokenStore = {
  get: () => accessToken,
  set(token) {
    accessToken = token || null;
    onAuthChange?.(accessToken);
  },
  subscribe(cb) { onAuthChange = cb; },
};

// ── Error class ─────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ── Core request ────────────────────────────────────────────────────────
async function doFetch(path, { method = "GET", body, headers = {}, query, signal } = {}) {
  let url = `${BASE}${path}`;
  if (query) {
    const qs = new URLSearchParams(Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "")
    )).toString();
    if (qs) url += `?${qs}`;
  }

  const opts = {
    method,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    signal,
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  return fetch(url, opts);
}

async function parse(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return { ok: false, error: { code: "BAD_RESPONSE", message: text.slice(0, 200) } }; }
}

async function tryRefresh() {
  // Coalesce parallel refreshes into a single network call.
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const res = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "include" });
      const body = await parse(res);
      if (!res.ok || !body?.ok) {
        tokenStore.set(null);
        return null;
      }
      tokenStore.set(body.data.accessToken);
      return body.data;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function request(path, options = {}) {
  let res = await doFetch(path, options);
  let body = await parse(res);

  // One silent retry after refresh on 401. Skip for auth endpoints themselves.
  const isAuthEndpoint = path.startsWith("/auth/");
  if (res.status === 401 && !isAuthEndpoint && !options._retried) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch(path, { ...options, _retried: true });
      body = await parse(res);
    }
  }

  if (!res.ok || !body?.ok) {
    const err = body?.error || { code: "REQUEST_FAILED", message: res.statusText };
    throw new ApiError(res.status, err.code, err.message, err.details);
  }
  return body.data;
}

// Convenience verbs
export const http = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export const API_BASE = BASE;
