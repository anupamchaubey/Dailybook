import React, { useEffect, useState } from "react";
import { profileApi } from "../api.js";

function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileApi
      .getMyProfile()
      .then(setProfile)
      .catch((err) =>
        setError(err.message || "Failed to load profile")
      );
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.username}</h1>

      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Avatar"
          style={{ width: "80px", borderRadius: "50%" }}
        />
      )}

      {profile.bio && (
        <p style={{ marginTop: "0.5rem" }}>{profile.bio}</p>
      )}

      {profile.joinedAt && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "#555",
            marginTop: "0.25rem"
          }}
        >
          Joined{" "}
          {new Date(profile.joinedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default MyProfilePage;
