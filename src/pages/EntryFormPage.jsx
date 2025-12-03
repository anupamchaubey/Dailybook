import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEntry, getEntryById, updateEntry } from "../api";
import { uploadImageToCloudinary } from "../cloudinary";

const VISIBILITY_OPTIONS = ["PUBLIC", "PRIVATE", "FOLLOWERS_ONLY"];

function EntryFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    async function load() {
      if (!isEdit) return;
      try {
        setLoading(true);
        const entry = await getEntryById(id);
        setTitle(entry.title || "");
        setContent(entry.content || "");
        setVisibility(entry.visibility || "PRIVATE");
        setTagsInput((entry.tags || []).join(", "));
        setImageUrls(entry.imageUrls || []); // multiple images
      } catch (e) {
        setError(e.message || "Failed to load entry");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  function parseTags(input) {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const urls = await Promise.all(
        files.map((file) => uploadImageToCloudinary(file))
      );
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const tags = parseTags(tagsInput);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags,
      visibility,
      imageUrls, // send list of URLs to backend
    };

    try {
      setSaving(true);
      if (isEdit) {
        await updateEntry(id, payload);
      } else {
        await createEntry(payload);
      }
      navigate("/me/entries");
    } catch (e1) {
      setError(e1.message || "Failed to save entry");
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h1>{isEdit ? "Edit entry" : "New entry"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
          />
        </div>

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. life, coding, diary"
          />
        </div>

        <div className="form-group">
          <label>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Images (optional, you can select multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {uploadingImages && <p>Uploading images...</p>}
          {imageUrls.length > 0 && (
            <div className="entry-images">
              {imageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Preview"
                  className="entry-image"
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </form>
    </section>
  );
}

export default EntryFormPage;
