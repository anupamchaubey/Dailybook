import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api";

function MyProfilePage() {
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const profile = await getMyProfile();
        setForm({
          username: profile.username || "",
          bio: profile.bio || "",
          profilePicture: profile.profilePicture || "",
        });
      } catch (e) {
        setError(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      setSaving(true);
      const updated = await updateMyProfile(form);
      setForm({
        username: updated.username || "",
        bio: updated.bio || "",
        profilePicture: updated.profilePicture || "",
      });
      setInfo("Profile updated.");
    } catch (e1) {
      setError(e1.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h1>My profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {info && <p style={{ color: "green" }}>{info}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Username (public)</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Profile picture URL</label>
          <input
            name="profilePicture"
            value={form.profilePicture}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}</button>
      </form>
    </section>
  );
}

export default MyProfilePage;
