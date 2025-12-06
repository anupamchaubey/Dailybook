import React, { useEffect, useState } from "react";
import { notificationsApi } from "../api.js";
import Pagination from "../components/Pagination.jsx";

function NotificationsPage() {
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const load = () => {
    notificationsApi
      .getNotifications({ page, size: 10 })
      .then((data) => setPageData(data))
      .catch((err) =>
        setError(err.message || "Failed to load notifications")
      );
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllAsRead();
      load();
    } catch (err) {
      alert(err.message || "Failed to mark all as read");
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      load();
    } catch (err) {
      alert(err.message || "Failed to mark as read");
    }
  };

  return (
    <div>
      <h1>Notifications</h1>

      <button
        type="button"
        onClick={handleMarkAll}
        style={{ marginBottom: "0.75rem" }}
      >
        Mark all as read
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!pageData && !error && <p>Loading...</p>}

      {pageData && (
        <>
          <ul>
            {pageData.content.map((n) => (
              <li
                key={n.id}
                style={{
                  marginBottom: "0.5rem",
                  opacity: n.read ? 0.6 : 1
                }}
              >
                <strong>{n.type}</strong> · {n.message} ·{" "}
                {new Date(n.createdAt).toLocaleString()}
                {!n.read && (
                  <button
                    type="button"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => handleMarkOne(n.id)}
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>

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

export default NotificationsPage;
