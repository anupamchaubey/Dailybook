import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { entriesApi } from "../api.js";
import VisibilityBadge from "../components/VisibilityBadge.jsx";
import { useAuth } from "../AuthContext.jsx";

function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    entriesApi
      .getEntry(id)
      .then((data) => setEntry(data))
      .catch((err) =>
        setError(err.message || "Failed to load entry")
      );
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this entry?")) return;

    try {
      await entriesApi.deleteEntry(id);
      navigate("/me/entries");
    } catch (err) {
      alert(err.message || "Failed to delete entry");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!entry) return <p>Loading...</p>;

  return (
    <div>
      <h1>{entry.title}</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          by{" "}
          <Link to={`/users/${entry.authorUsername}`}>
            {entry.authorUsername}
          </Link>{" "}
          · {new Date(entry.createdAt).toLocaleString()}
        </div>

        <VisibilityBadge visibility={entry.visibility} />
      </div>

      <p
        style={{
          marginTop: "1rem",
          whiteSpace: "pre-wrap"
        }}
      >
        {entry.content}
      </p>

      {entry.tags && (
        <p style={{ marginTop: "0.5rem" }}>
          {entry.tags.map((t) => (
            <span
              key={t}
              style={{ marginRight: "0.5rem" }}
            >
              #{t}
            </span>
          ))}
        </p>
      )}
      {entry.imageUrls && entry.imageUrls.length > 0 && (
        <div className="entry-images">
            {entry.imageUrls.map((url) => (
              <img
                key={url}
                src={url}
                alt="Entry"
                className="entry-image"
              />
            ))}
        </div>
        )}


      {isAuthenticated && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem"
          }}
        >
          <Link to={`/entries/${entry.id}/edit`}>
            Edit
          </Link>

          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EntryDetailPage;
