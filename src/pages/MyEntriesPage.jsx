import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { entriesApi } from "../api.js";
import EntryCard from "../components/EntryCard.jsx";

function MyEntriesPage() {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    entriesApi
      .getMyEntries()
      .then((data) => setEntries(data))
      .catch((err) =>
        setError(err.message || "Failed to load your entries")
      );
  }, []);

  return (
    <div>
      <h1>My Entries</h1>

      <Link to="/entries/new">+ Create new entry</Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!entries && !error && <p>Loading...</p>}

      {entries &&
        (entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        ))}
    </div>
  );
}

export default MyEntriesPage;
