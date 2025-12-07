// src/api.js
const API_BASE_URL = "https://dailybook-x50p.onrender.com";

let authToken = null;
let authExpiresAt = null;

/* ---------------- Auth storage helpers ---------------- */

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

/* ---------------- Utility helpers ---------------- */

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

  // Only set JSON header if not sending FormData
  if (!(body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // Always send Authorization when we have a token
  if (authToken) {
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

/* ---------------- AUTH (/api/auth) ---------------- */

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

/* ---------------- ENTRIES (/api/entries) ---------------- */

export const entriesApi = {
  // 2.1 Create entry (auth required)
  createEntry(data) {
    return request("/api/entries", { method: "POST", body: data }, true);
  },

  // 2.2 Get my entries (auth required)
  getMyEntries() {
    return request("/api/entries", {}, true);
  },

  // 2.3 Get single entry (token sent if available)
  getEntry(id) {
    return request(`/api/entries/${id}`);
  },

  // Update entry (auth required)
  updateEntry(id, data) {
    return request(
      `/api/entries/${id}`,
      { method: "PUT", body: data },
      true
    );
  },

  // 2.5 Delete my entry (auth required)
  deleteEntry(id) {
    return request(
      `/api/entries/${id}`,
      { method: "DELETE" },
      true
    );
  },

  // 2.6 Public posts listing (paged)
  getPublicEntries({ page = 0, size = 10, tag } = {}) {
    const q = buildQuery({ page, size, tag });
    return request(`/api/entries/public${q}`);
  },

  // 2.7 Public posts of a specific user
  getPublicEntriesByUser(username, { page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(
      `/api/entries/public/user/${encodeURIComponent(username)}${q}`
    );
  },

  // 2.8 Search (visibility-aware, requires auth)
  searchEntries({ q, page = 0, size = 10 } = {}) {
    const query = buildQuery({ q, page, size });
    return request(`/api/entries/public/search${query}`, {}, true);
  },

  // 2.9 Feed (requires auth)
  getFeedEntries({ page = 0, size = 10, tag } = {}) {
    const q = buildQuery({ page, size, tag });
    return request(`/api/entries/feed${q}`, {}, true);
  }
};

/* ---------------- FOLLOW (/api/follow) ---------------- */

export const followApi = {
  // 3.1 Send follow request
  follow(username) {
    return request(
      `/api/follow/${encodeURIComponent(username)}`,
      { method: "POST" },
      true
    );
  },

  // 3.2 Unfollow / cancel
  unfollow(username) {
    return request(
      `/api/follow/${encodeURIComponent(username)}`,
      { method: "DELETE" },
      true
    );
  },

  // 3.3 Followers list
  getMyFollowers() {
    return request("/api/follow/me/followers", {}, true);
  },

  // 3.4 Following list
  getMyFollowing() {
    return request("/api/follow/me/following", {}, true);
  },

  // 3.5 Pending follow requests
  getPendingRequests() {
    return request("/api/follow/me/requests", {}, true);
  },

  // 3.6 Approve follow request
  approveRequest(username) {
    return request(
      `/api/follow/approve/${encodeURIComponent(username)}`,
      { method: "POST" },
      true
    );
  },

  // 3.7 Reject follow request
  rejectRequest(username) {
    return request(
      `/api/follow/reject/${encodeURIComponent(username)}`,
      { method: "DELETE" },
      true
    );
  }
};

/* ---------------- NOTIFICATIONS (/api/notifications) ---------------- */

export const notificationsApi = {
  // 4.1 List my notifications (paged)
  getNotifications({ page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(`/api/notifications${q}`, {}, true);
  },

  // 4.2 Get unread count
  getUnreadCount() {
    return request("/api/notifications/unread-count", {}, true);
  },

  // 4.3 Mark single as read
  markAsRead(id) {
    return request(
      `/api/notifications/${encodeURIComponent(id)}/read`,
      { method: "POST" },
      true
    );
  },

  // 4.4 Mark all as read
  markAllAsRead() {
    return request(
      "/api/notifications/read-all",
      { method: "POST" },
      true
    );
  }
};

/* ---------------- USERS (public author page) ---------------- */

export const usersApi = {
  // 5.1 Public list of a user's posts
  getUserEntries(username, { page = 0, size = 10 } = {}) {
    const q = buildQuery({ page, size });
    return request(
      `/api/users/${encodeURIComponent(username)}/entries${q}`
    );
  }
};

/* ---------------- PROFILE (/api/profile) ---------------- */

export const profileApi = {
  // 6.1 Get my profile
  getMyProfile() {
    return request("/api/profile/me", {}, true);
  },

  // 6.2 Update my profile
  updateMyProfile(data) {
    return request(
      "/api/profile/me",
      { method: "PUT", body: data },
      true
    );
  },

  // 6.3 Get profile by username
  getProfile(username) {
    return request(`/api/profile/${encodeURIComponent(username)}`);
  },

  // 6.4 Search users
  searchProfiles(query) {
    const q = buildQuery({ query });
    return request(`/api/profile/search${q}`);
  }
};
