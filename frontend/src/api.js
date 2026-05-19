const isProd = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_URL || (isProd ? "/api" : "http://localhost:8000");

export function getStoredAuth() {
  const raw = localStorage.getItem("nexflow_auth");
  return raw ? JSON.parse(raw) : null;
}

export function storeAuth(auth) {
  localStorage.setItem("nexflow_auth", JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem("nexflow_auth");
}

export async function apiRequest(path, options = {}) {
  const auth = getStoredAuth();
  const headers = {
    "Content-Type": "application/json",
    "bypass-tunnel-warning": "true",
    "Bypass-Tunnel-Reminder": "true",
    ...(options.headers || {}),
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }
  return data;
}

export { API_BASE_URL };
