// src/api.js
const API_BASE_URL = "https://dailybook-x50p.onrender.com";

let authToken = null;
let authExpiresAt = null;

function loadAuthFromStorage() {
  const token = localStorage.getItem("authToken");
  const expiresAt = localStorage.getItem("authExpiresAt");
  if (token && expiresAt) {
    authToken = token;
    authExpiresAt = Number(expiresAt);
  }
}
loadAuthFromStorage();

export function setAuth(token, expiresAt) {
  authToken = token;
  authExpiresAt = expiresAt;
  localStorage.setItem("authToken", token);
  localStorage.setItem("authExpiresAt", String(expiresAt));
}

export function clearAuth() {
  authToken = null;
  authExpiresAt = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authExpiresAt");
}

export function getAuth() {
  return { token: authToken, expiresAt: authExpiresAt };
}

/* ---------- helpers ---------- */

function buildQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      sp.append(k, v);
    }
  });
  return sp.toString() ? `?${sp}` : "";
}

async function request(
  path,
  { method = "GET", body, headers = {} } = {},
  requireAuth = false
) {
  if (requireAuth && !authToken) {
    throw new Error("Not authenticated");
  }

  const finalHeaders = {
    ...headers
  };

  // only set JSON header if not sending FormData
  if (!(body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (requireAuth && authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  const ct = res.headers.get("Content-Type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

/* ---------- AUTH ---------- */

export const authApi = {
  register(data) {
    return request("/api/auth/register", {
      method: "POST",
      body: data
    });
  },

  async login(data) {
    const res = await request("/api/auth/login", {
      method: "POST",
      body: data
    });
    setAuth(res.token, res.expiresAt);
    return res;
  }
};

/* ---------- ENTRIES ---------- */

export const entriesApi = {
  createEntry(data) {
    return request("/api/entries", { method: "POST", body: data }, true);
  },

  getMyEntries() {
    return request("/api/entries", {}, true);
  },

  getEntry(id) {
    return request(`/api/entries/${id}`);
  },

  updateEntry(id, data) {
    return request(`/api/entries/${id}`, { method: "PUT", body: data }, true);
  },

  deleteEntry(id) {
    return request(`/api/entries/${id}`, { method: "DELETE" }, true);
  },

  getPublicEntries({ page = 0, size = 10, tag } = {}) {
    const q = buildQuery({ page, size, tag });
    return request(`/api/entries/public${q}`);
  },

  getPublicEntriesByUser(username, { page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(
      `/api/entries/public/user/${encodeURIComponent(username)}${q}`
    );
  },

  searchEntries({ q, page = 0, size = 10 } = {}) {
    const query = buildQuery({ q, page, size });
    return request(`/api/entries/public/search${query}`, {}, true);
  },

  getFeedEntries({ page = 0, size = 10, tag } = {}) {
    const q = buildQuery({ page, size, tag });
    return request(`/api/entries/feed${q}`);
  }
};

/* ---------- FOLLOW ---------- */

export const followApi = {
  follow(username) {
    return request(
      `/api/follow/${encodeURIComponent(username)}`,
      { method: "POST" },
      true
    );
  },

  unfollow(username) {
    return request(
      `/api/follow/${encodeURIComponent(username)}`,
      { method: "DELETE" },
      true
    );
  },

  getMyFollowers() {
    return request("/api/follow/me/followers", {}, true);
  },

  getMyFollowing() {
    return request("/api/follow/me/following", {}, true);
  },

  getPendingRequests() {
    return request("/api/follow/me/requests", {}, true);
  },

  approveRequest(username) {
    return request(
      `/api/follow/approve/${encodeURIComponent(username)}`,
      { method: "POST" },
      true
    );
  },

  rejectRequest(username) {
    return request(
      `/api/follow/reject/${encodeURIComponent(username)}`,
      { method: "DELETE" },
      true
    );
  }
};

/* ---------- NOTIFICATIONS ---------- */

export const notificationsApi = {
  getNotifications({ page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(`/api/notifications${q}`, {}, true);
  },

  getUnreadCount() {
    return request("/api/notifications/unread-count", {}, true);
  },

  markAsRead(id) {
    return request(
      `/api/notifications/${encodeURIComponent(id)}/read`,
      { method: "POST" },
      true
    );
  },

  markAllAsRead() {
    return request("/api/notifications/read-all", { method: "POST" }, true);
  }
};

/* ---------- USERS / PROFILE ---------- */

export const usersApi = {
  getUserEntries(username, { page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(`/api/users/${encodeURIComponent(username)}/entries${q}`);
  }
};

export const profileApi = {
  getMyProfile() {
    return request("/api/profile/me", {}, true);
  },

  updateMyProfile(data) {
    return request(
      "/api/profile/me",
      { method: "PUT", body: data },
      true
    );
  },

  getProfile(username) {
    return request(`/api/profile/${encodeURIComponent(username)}`);
  },

  searchProfiles(query) {
    const q = buildQuery({ query });
    return request(`/api/profile/search${q}`);
  }
};
