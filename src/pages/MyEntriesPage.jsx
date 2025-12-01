import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteEntry, getMyEntries } from "../api";
import EntryCard from "../components/EntryCard";

function MyEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await getMyEntries();
      setEntries(data || []);
    } catch (e) {
      setError(e.message || "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    const ok = window.confirm("Delete this entry?");
    if (!ok) return;
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  }

  return (
    <section>
      <h1>My entries</h1>
      <p>
        <Link to="/me/entries/new">Create new entry →</Link>
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && entries.length === 0 && (
        <p>You have not written any entries yet.</p>
      )}

      <div className="post-list">
        {entries.map((entry) => (
          <div key={entry.id} className="post-card-wrapper">
            <EntryCard entry={entry} showAuthor={false} />
            <div className="entry-actions">
              <button
                onClick={() => navigate(`/me/entries/${entry.id}/edit`)}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyEntriesPage;
