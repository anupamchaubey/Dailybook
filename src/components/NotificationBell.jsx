import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsApi } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

function NotificationBell() {
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    notificationsApi
      .getUnreadCount()
      .then((c) => setCount(typeof c === "number" ? c : Number(c)))
      .catch(() => {});
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/me/notifications")}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "1rem"
      }}
      title="Notifications"
    >
      🔔

      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-6px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "0 6px",
            fontSize: "0.7rem",
            lineHeight: "1.2"
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
