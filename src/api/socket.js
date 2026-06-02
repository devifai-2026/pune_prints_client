// Socket.IO helpers — two namespaces match the backend.
//   /templates : public, no auth, broadcasts on admin template writes.
//   /orders    : JWT-authed; auto-joins user + admin rooms server-side.

import { io } from "socket.io-client";
import { tokenStore } from "./http.js";

const BASE = import.meta.env.VITE_SOCKET_BASE || "http://localhost:4000";

let templatesSocket = null;
let ordersSocket = null;

export function getTemplatesSocket() {
  if (!templatesSocket) {
    templatesSocket = io(`${BASE}/templates`, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return templatesSocket;
}

export function getOrdersSocket() {
  const token = tokenStore.get();
  if (!token) return null;
  if (ordersSocket?.connected) return ordersSocket;

  ordersSocket?.disconnect();
  ordersSocket = io(`${BASE}/orders`, {
    withCredentials: true,
    auth: { token },
    transports: ["websocket", "polling"],
  });
  return ordersSocket;
}

export function disconnectAllSockets() {
  templatesSocket?.disconnect();
  templatesSocket = null;
  ordersSocket?.disconnect();
  ordersSocket = null;
}
