const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload, auth: false }),

  getTasks: (page = 1, limit = 100) =>
    request(`/api/tasks?page=${page}&limit=${limit}`),
  createTask: (task) => request("/api/tasks", { method: "POST", body: task }),
  updateTask: (id, updates) =>
    request(`/api/tasks/${id}`, { method: "PUT", body: updates }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),

  getSessions: (page = 1, limit = 20) =>
    request(`/api/sessions?page=${page}&limit=${limit}`),
  createSession: (session) =>
    request("/api/sessions", { method: "POST", body: session }),
  deleteSession: (id) => request(`/api/sessions/${id}`, { method: "DELETE" }),
  getStats: () => request("/api/sessions/stats"),
};
