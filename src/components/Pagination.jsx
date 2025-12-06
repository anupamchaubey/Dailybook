import React from "react";
import { Link } from "react-router-dom";
import VisibilityBadge from "./VisibilityBadge.jsx";

function EntryCard({ entry }) {
  if (!entry) return null;

  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "0.75rem",
        marginBottom: "0.75rem"
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start"
        }}
      >
        <div>
          <Link to={`/entries/${entry.id}`} style={{ fontWeight: "bold" }}>
            {entry.title}
          </Link>
          <div style={{ fontSize: "0.85rem", color: "#555" }}>
            by{" "}
            <Link to={`/users/${entry.authorUsername}`}>
              {entry.authorUsername}
            </Link>{" "}
            · {new Date(entry.createdAt).toLocaleString()}
          </div>
        </div>

        <VisibilityBadge visibility={entry.visibility} />
      </header>

      <p style={{ marginTop: "0.5rem" }}>
        {entry.content?.length > 200
          ? `${entry.content.slice(0, 200)}...`
          : entry.content}
      </p>

      {entry.tags && entry.tags.length > 0 && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.85rem",
            color: "#444"
          }}
        >
          {entry.tags.map((tag) => (
            <span key={tag} style={{ marginRight: "0.5rem" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default EntryCard;
