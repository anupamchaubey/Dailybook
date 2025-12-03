import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../api";
import { uploadImageToCloudinary } from "../cloudinary";

function MyProfilePage() {
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setInfo("");
    try {
      setUploadingAvatar(true);
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, profilePicture: url }));
      setInfo("Profile picture uploaded.");
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
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
          <label>Profile picture</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {uploadingAvatar && <p>Uploading...</p>}
          {form.profilePicture && (
            <div style={{ marginTop: "0.5rem" }}>
              <img
                src={form.profilePicture}
                alt="Avatar preview"
                className="avatar-large"
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}

export default MyProfilePage;
