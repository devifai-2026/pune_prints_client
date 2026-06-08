import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Strip the stored 91-prefix back to a display-friendly 10-digit number.
export function localPhone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// Pretty form: "+91 98765 43210".
export function formatPhone(phone) {
  const local = localPhone(phone);
  if (local.length !== 10) return phone || "";
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

// Contact-form prefill derived from a logged-in user (empty object if none).
export function contactPrefillFromUser(user) {
  if (!user) return {};
  const out = {};
  if (user.name) out.name = user.name;
  if (user.email) out.email = user.email;
  if (user.phone) out.phone = formatPhone(user.phone);
  return out;
}
