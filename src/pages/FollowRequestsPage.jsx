import React, { useEffect, useState } from "react";
import { followApi } from "../api.js";

function FollowRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  const loadRequests = () => {
    followApi
      .getPendingRequests()
      .then((data) => setRequests(data || []))
      .catch((err) =>
        setError(err.message || "Failed to load requests")
      );
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (username) => {
    try {
      await followApi.approveRequest(username);
      loadRequests();
    } catch (err) {
      alert(err.message || "Approval failed");
    }
  };

  const handleReject = async (username) => {
    try {
      await followApi.rejectRequest(username);
      loadRequests();
    } catch (err) {
      alert(err.message || "Rejection failed");
    }
  };

  return (
    <div>
      <h1>Follow Requests</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((u) => (
            <li
              key={u}
              style={{ marginBottom: "0.5rem" }}
            >
              {u}

              <button
                type="button"
                onClick={() => handleApprove(u)}
                style={{ marginLeft: "0.5rem" }}
              >
                Approve
              </button>

              <button
                type="button"
                onClick={() => handleReject(u)}
                style={{ marginLeft: "0.5rem" }}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FollowRequestsPage;
