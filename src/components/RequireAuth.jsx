import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";

/**
 * Gate for authenticated-only routes. While the session is still bootstrapping
 * we show a spinner (not a redirect) to avoid bouncing a logged-in user to the
 * login screen on first paint. Once resolved, anonymous users are sent to
 * /login with a `from` hint so they return here after signing in.
 */
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-text-light">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
