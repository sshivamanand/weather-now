const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const API_BASE_URL = RAW_BACKEND_URL.replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const { method = "GET", headers = {}, body, ...rest } = options;

  const requestHeaders = { ...headers };
  let requestBody = body;

  if (body && !(body instanceof FormData) && typeof body === "object") {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: requestHeaders,
      body: requestBody,
      ...rest,
    });
  } catch {
    throw new Error("Network error. Check backend server and CORS settings.");
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
}
