import React, { useEffect, useState } from "react";
import { entriesApi } from "../api.js";
import EntryCard from "../components/EntryCard.jsx";
import Pagination from "../components/Pagination.jsx";

function FeedPage() {
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

    entriesApi
      .getFeedEntries({ page, size: 10 })
      .then((data) => setPageData(data))
      .catch((err) => setError(err.message || "Failed to load feed"));
  }, [page]);

  return (
    <div>
      <h1>Home Feed</h1>

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

export default FeedPage;
