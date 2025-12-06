import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { entriesApi } from "../api.js";
import { uploadImageToCloudinary } from "../cloudinary.js";

const defaultEntry = {
  title: "",
  content: "",
  tags: [],
  visibility: "PUBLIC",
  imageUrls: []
};

function EntryFormPage({ mode }) {
  const isCreate = mode === "create";
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(defaultEntry);
  const [tagsInput, setTagsInput] = useState("");
  const [imagesInput, setImagesInput] = useState(""); // comma-separated URL text
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing entry for edit mode
  useEffect(() => {
    if (!isCreate && id) {
      entriesApi
        .getEntry(id)
        .then((data) => {
          setEntry({
            title: data.title,
            content: data.content,
            tags: data.tags || [],
            visibility: data.visibility,
            imageUrls: data.imageUrls || []
          });
          setTagsInput((data.tags || []).join(","));
          setImagesInput((data.imageUrls || []).join(","));
        })
        .catch((err) =>
          setError(err.message || "Failed to load entry")
        );
    }
  }, [id, isCreate]);

  const handleChange = (e) => {
    setEntry((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle Cloudinary upload when user chooses a file
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);

      // Update entry.imageUrls and the comma-separated text field
      setEntry((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), url]
      }));
      setImagesInput((prev) =>
        prev ? `${prev},${url}` : url
      );
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      // Clear file input so same file can be reselected if needed
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...entry,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrls: imagesInput
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
    };

    try {
      let result;
      if (isCreate) {
        result = await entriesApi.createEntry(payload);
      } else {
        result = await entriesApi.updateEntry(id, payload);
      }
      navigate(`/entries/${result.id}`);
    } catch (err) {
      setError(err.message || "Save failed");
    }
  };

  return (
    <div>
      <h1>{isCreate ? "Create Entry" : "Edit Entry"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={entry.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            rows={8}
            value={entry.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Visibility</label>
          <select
            name="visibility"
            value={entry.visibility}
            onChange={handleChange}
          >
            <option value="PUBLIC">PUBLIC</option>
            <option value="PRIVATE">PRIVATE</option>
            <option value="FOLLOWERS_ONLY">FOLLOWERS_ONLY</option>
          </select>
        </div>

        {/* Manual URLs (optional) */}
        <div className="form-group">
          <label>Image URLs (comma separated)</label>
          <input
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
          />
        </div>

        {/* Upload to Cloudinary */}
        <div className="form-group">
          <label>Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
          {uploading && <p>Uploading image...</p>}
        </div>

        {/* Preview currently attached images */}
        {entry.imageUrls && entry.imageUrls.length > 0 && (
          <div className="entry-images">
            {entry.imageUrls.map((url) => (
              <img
                key={url}
                src={url}
                alt="entry"
                className="entry-image"
              />
            ))}
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {isCreate ? "Create" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default EntryFormPage;
