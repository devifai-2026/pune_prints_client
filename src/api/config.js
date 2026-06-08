// Central API config. Flip `isProd` to switch between the live Render backend
// and a local dev server. (No .env file involved — this is the single source
// of truth for which backend the app talks to.)
export const isProd = true;

const PROD = {
  API_BASE: "https://pune-prints-server.onrender.com/api/v1",
  SOCKET_BASE: "https://pune-prints-server.onrender.com",
};

const DEV = {
  API_BASE: "http://localhost:4000/api/v1",
  SOCKET_BASE: "http://localhost:4000",
};

export const API_BASE = isProd ? PROD.API_BASE : DEV.API_BASE;
export const SOCKET_BASE = isProd ? PROD.SOCKET_BASE : DEV.SOCKET_BASE;
