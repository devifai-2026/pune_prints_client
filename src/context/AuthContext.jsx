import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";
import { disconnectAllSockets } from "../api/socket.js";

const AuthContext = createContext(null);

/**
 * Source of truth for "who is signed in".
 *
 *   { user, status, login, signup, logout, refresh }
 *
 * status: 'loading' until bootstrap finishes, then 'authenticated' | 'anonymous'.
 * Components should render skeletons while status === 'loading' to avoid
 * a guest-state flash on first paint.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  // Try to silently restore the session on mount via the refresh cookie.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await authApi.bootstrapSession();
      if (!mounted) return;
      setUser(u);
      setStatus(u ? "authenticated" : "anonymous");
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (credentials) => {
    const u = await authApi.login(credentials);
    setUser(u);
    setStatus("authenticated");
    return u;
  };

  const signup = async (payload) => {
    const u = await authApi.register(payload);
    setUser(u);
    setStatus("authenticated");
    return u;
  };

  const logout = async () => {
    await authApi.logout();
    disconnectAllSockets();
    setUser(null);
    setStatus("anonymous");
  };

  const value = useMemo(() => ({
    user,
    status,
    isAuthenticated: status === "authenticated",
    isAdmin: user?.role === "admin",
    login,
    signup,
    logout,
  }), [user, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
