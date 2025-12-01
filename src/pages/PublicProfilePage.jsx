import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, listPublicEntriesByUser } from "../api";
import EntryCard from "../components/EntryCard";

function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(page = 0) {
    try {
      setLoading(true);
      setError("");
      const [profileData, entriesData] = await Promise.all([
        getUserProfile(username),
        listPublicEntriesByUser(username, { page }),
      ]);
      setProfile(profileData);
      setEntries(entriesData.content || []);
      setPageInfo({
        page: entriesData.number,
        totalPages: entriesData.totalPages,
      });
    } catch (e) {
      setError(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(0);
  }, [username]);

  function handlePageChange(newPage) {
    if (newPage < 0 || newPage >= pageInfo.totalPages) return;
    load(newPage);
  }

  if (loading && !profile) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section>
      <div className="profile-header">
        {profile?.profilePicture && (
          <img
            src={profile.profilePicture}
            alt={profile.username}
            className="avatar-large"
          />
        )}
        <div>
          <h1>@{profile?.username}</h1>
          {profile?.bio && <p>{profile.bio}</p>}
        </div>
      </div>

      <h2>Public entries</h2>
      {entries.length === 0 && <p>No public entries yet.</p>}

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

export default PublicProfilePage;
