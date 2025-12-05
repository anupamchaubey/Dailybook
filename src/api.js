// src/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://dailybook-x50p.onrender.com";

// ---- Internal generic request helper ----
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("Content-Type") || "";
  let data;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    let message = "Request failed";

    if (data && typeof data === "object" && data.errors) {
      if (typeof data.errors === "string") {
        message = data.errors;
      } else {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey) {
          message = data.errors[firstKey];
        }
      }
    } else if (typeof data === "string" && data.trim()) {
      message = data;
    }

    const error = new Error(message);
    error.status = res.status;   // 🔹 attach status
    throw error;
  }

  return data;
}

// ============ AUTH ============

export async function registerApi({ username, email, password }) {
  // POST /api/auth/register  → plain text ("User registration done ...")
  return request("/api/auth/register", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
}

export async function loginApi({ username, password }) {
  // POST /api/auth/login  → { token: "..." }
  return request("/api/auth/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
}

// ============ PROFILE (LOGGED-IN USER) ============

export async function getMyProfile() {
  // GET /api/profile
  return request("/api/profile", {
    method: "GET",
  });
}

export async function updateMyProfile({ username, bio, profilePicture }) {
  // PUT /api/profile
  return request("/api/profile", {
    method: "PUT",
    body: { username, bio, profilePicture },
  });
}

// ============ ENTRIES (PRIVATE – REQUIRE AUTH) ============

export async function getMyEntries() {
  // GET /api/entries
  return request("/api/entries", {
    method: "GET",
  });
}

export async function getEntryById(id) {
  // GET /api/entries/{id}
  return request(`/api/entries/${id}`, {
    method: "GET",
  });
}

export async function createEntry(payload) {
  // POST /api/entries
  return request("/api/entries", {
    method: "POST",
    body: payload,
  });
}

export async function updateEntry(id, payload) {
  // PUT /api/entries/{id}
  return request(`/api/entries/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteEntry(id) {
  // DELETE /api/entries/{id}
  return request(`/api/entries/${id}`, {
    method: "DELETE",
  });
}

// ============ PUBLIC ENTRIES (NO AUTH REQUIRED) ============

// Explore public posts
export async function listPublicEntries({ page = 0, size = 10, tag } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (tag) {
    params.set("tag", tag);
  }

  // You have /api/public/entries in PublicEntryController
  return request(`/api/public/entries?${params.toString()}`, {
    method: "GET",
    auth: false,
  });
}

// Search public posts by text
export async function searchPublicEntries({ q, page = 0, size = 10 }) {
  const params = new URLSearchParams();
  params.set("q", q);
  params.set("page", page);
  params.set("size", size);

  return request(`/api/public/entries/search?${params.toString()}`, {
    method: "GET",
    auth: false,
  });
}

// List public entries by username (author page)
export async function listPublicEntriesByUser(
  username,
  { page = 0, size = 10 } = {}
) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);

  // GET /api/users/{username}/entries
  return request(`/api/users/${encodeURIComponent(username)}/entries?${params.toString()}`, {
    method: "GET",
    auth: false,
  });
}

// ============ PUBLIC PROFILES ============

export async function getUserProfile(username) {
  // GET /api/profile/{username} (public)
  return request(`/api/profile/${encodeURIComponent(username)}`, {
    method: "GET",
    auth: false,
  });
}

// Optional: search users (if you want to use it later)
export async function searchUsers(query) {
  return request(`/api/profile/search?q=${encodeURIComponent(query)}`, {
    method: "GET",
    auth: false,
  });
}
