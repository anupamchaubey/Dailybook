import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profileApi, usersApi } from "../api.js";
import EntryCard from "../components/EntryCard.jsx";
import Pagination from "../components/Pagination.jsx";

function ProfilePage() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [postsPage, setPostsPage] = useState(null);
  const [postsPageNo, setPostsPageNo] = useState(0);

  const [error, setError] = useState(null);

  useEffect(() => {
    profileApi
      .getProfile(username)
      .then(setProfile)
      .catch((err) =>
        setError(err.message || "Failed to load profile")
      );
  }, [username]);

  useEffect(() => {
    usersApi
      .getUserEntries(username, {
        page: postsPageNo,
        size: 10
      })
      .then(setPostsPage)
      .catch(() => {});
  }, [username, postsPageNo]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{profile.username}</h1>

      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Avatar"
          style={{
            width: "80px",
            borderRadius: "50%"
          }}
        />
      )}

      {profile.bio && (
        <p style={{ marginTop: "0.5rem" }}>
          {profile.bio}
        </p>
      )}

      {profile.joinedAt && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "#555"
          }}
        >
          Joined{" "}
          {new Date(
            profile.joinedAt
          ).toLocaleString()}
        </p>
      )}

      <h2 style={{ marginTop: "1rem" }}>
        Public Posts
      </h2>

      {!postsPage && <p>Loading posts...</p>}

      {postsPage && (
        <>
          {postsPage.content.map((p) => (
            <EntryCard key={p.id} entry={p} />
          ))}

          <Pagination
            page={postsPage.number}
            totalPages={postsPage.totalPages}
            onChange={setPostsPageNo}
          />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
