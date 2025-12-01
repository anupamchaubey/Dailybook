import React from "react";
import { Link } from "react-router-dom";

function EntryCard({ entry, showAuthor = true }) {
  const {
    id,
    title,
    content,
    tags,
    visibility,
    createdAt,
    authorUsername,
    authorProfilePicture,
  } = entry;

  const shortContent =
    content && content.length > 180
      ? content.slice(0, 180) + "..."
      : content;

  return (
    <article className="post-card">
      <div className="post-card-header">
        <h2>{title}</h2>
        <span className="badge">{visibility}</span>
      </div>

      {showAuthor && authorUsername && (
        <div className="meta author">
          {authorProfilePicture && (
            <img
              src={authorProfilePicture}
              alt={authorUsername}
              className="avatar"
            />
          )}
          <Link to={`/users/${authorUsername}`}>@{authorUsername}</Link>
        </div>
      )}

      {createdAt && (
        <p className="meta">{new Date(createdAt).toLocaleString()}</p>
      )}

      <p>{shortContent}</p>

      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default EntryCard;
