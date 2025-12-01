import React, { useEffect, useState } from "react";
import { listPublicEntries, searchPublicEntries } from "../api";
import EntryCard from "../components/EntryCard";

function ExplorePage() {
  const [entries, setEntries] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [mode, setMode] = useState("feed");

  async function load({ page = 0, useSearch = false } = {}) {
    try {
      setLoading(true);
      setError("");
      let data;
      if (useSearch && search.trim()) {
        data = await searchPublicEntries({ q: search.trim(), page });
        setMode("search");
      } else {
        data = await listPublicEntries({ page, tag: tag || undefined });
        setMode("feed");
      }
      setEntries(data.content || []);
      setPageInfo({ page: data.number, totalPages: data.totalPages });
    } catch (e) {
      setError(e.message || "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ page: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    load({ page: 0, useSearch: true });
  }

  function handlePageChange(newPage) {
    if (newPage < 0 || newPage >= pageInfo.totalPages) return;
    load({ page: newPage, useSearch: mode === "search" });
  }

  return (
    <section>
      <h1>Explore public entries</h1>

      <form onSubmit={handleSubmit} className="search-bar">
        <input
          placeholder="Search title, content, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Tag filter (optional)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && entries.length === 0 && <p>No entries found.</p>}

      <div className="post-list">
        {entries.map((e) => (
          <EntryCard key={e.id} entry={e} />
        ))}
      </div>

      {pageInfo.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pageInfo.page - 1)}
            disabled={pageInfo.page === 0}
          >
            Previous
          </button>
          <span>
            Page {pageInfo.page + 1} of {pageInfo.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageInfo.page + 1)}
            disabled={pageInfo.page + 1 >= pageInfo.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default ExplorePage;
