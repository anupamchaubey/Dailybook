import React, { useEffect, useState } from "react";
import { entriesApi } from "../api.js";
import EntryCard from "../components/EntryCard.jsx";
import Pagination from "../components/Pagination.jsx";

function ExplorePublicPage() {
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);

  const [tagInput, setTagInput] = useState("");
  const [activeTag, setActiveTag] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

    entriesApi
      .getPublicEntries({
        page,
        size: 10,
        tag: activeTag || undefined
      })
      .then(setPageData)
      .catch((err) =>
        setError(err.message || "Failed to load public entries")
      );
  }, [page, activeTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveTag(tagInput.trim());
  };

  return (
    <div>
      <h1>Explore Public Posts</h1>

      <form
        onSubmit={handleSearch}
        style={{ marginBottom: "1rem" }}
      >
        <input
          placeholder="Filter by tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />

        <button
          type="submit"
          style={{ marginLeft: "0.5rem" }}
        >
          Search
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!pageData && !error && <p>Loading...</p>}

      {pageData && (
        <>
          {pageData.content.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}

          <Pagination
            page={pageData.number}
            totalPages={pageData.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default ExplorePublicPage;
