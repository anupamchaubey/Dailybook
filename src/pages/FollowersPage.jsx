import React, { useEffect, useState } from "react";
import { followApi } from "../api.js";

function FollowersPage() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      followApi.getMyFollowers(),
      followApi.getMyFollowing()
    ])
      .then(([f1, f2]) => {
        setFollowers(f1 || []);
        setFollowing(f2 || []);
      })
      .catch((err) =>
        setError(err.message || "Failed to load follow data")
      );
  }, []);

  return (
    <div>
      <h1>Followers &amp; Following</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h2>Followers</h2>
          {followers.length === 0 ? (
            <p>No followers.</p>
          ) : (
            <ul>
              {followers.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2>Following</h2>
          {following.length === 0 ? (
            <p>Not following anyone.</p>
          ) : (
            <ul>
              {following.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersPage;
