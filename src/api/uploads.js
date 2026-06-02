import { http } from "./http.js";

/**
 * Convert a File/Blob to raw base64 (no data: prefix).
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const result = String(reader.result || "");
      const idx = result.indexOf("base64,");
      resolve(idx >= 0 ? result.slice(idx + 7) : result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file or base64 string to the server (which forwards to ImgBB).
 * @returns { id, url, displayUrl, thumbUrl, mediumUrl, width, height, size, mime }
 */
export async function uploadImage({ file, base64, name, expiration }) {
  const image = base64 ?? (file ? await fileToBase64(file) : null);
  if (!image) throw new Error("uploadImage: file or base64 required");
  return http.post("/uploads", { image, name: name || file?.name, expiration });
}
