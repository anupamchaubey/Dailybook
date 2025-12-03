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
    imageUrls,
  } = entry;

  const fullContent = content || "";

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

      {imageUrls && imageUrls.length > 0 && (
        <div className="entry-images">
          {imageUrls.map((url) => (
            <img key={url} src={url} alt={title} className="entry-image" />
          ))}
        </div>
      )}

      <p className="entry-content">{fullContent}</p>

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
