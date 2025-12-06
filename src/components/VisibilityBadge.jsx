import React from "react";

function VisibilityBadge({ visibility }) {
  const color =
    visibility === "PUBLIC"
      ? "green"
      : visibility === "PRIVATE"
      ? "red"
      : "orange";

  return (
    <span
      style={{
        padding: "0.15rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        border: `1px solid ${color}`,
        color: color,
        whiteSpace: "nowrap"
      }}
    >
      {visibility}
    </span>
  );
}

export default VisibilityBadge;
