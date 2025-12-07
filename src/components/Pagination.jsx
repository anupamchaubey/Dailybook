// src/components/Pagination.jsx
import React from "react";

function Pagination({ page, totalPages, onChange }) {
  // page is 0-based (from backend Page.number)
  const currentPage = typeof page === "number" ? page : 0;

  if (!totalPages || totalPages <= 1) {
    // No need to show pagination for 0 or 1 page
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      onChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onChange(currentPage + 1);
    }
  };

  const handleGoto = (p) => {
    if (p !== currentPage) {
      onChange(p);
    }
  };

  // Simple page number buttons (1, 2, 3, ...)
  const pageButtons = [];
  for (let i = 0; i < totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        type="button"
        onClick={() => handleGoto(i)}
        disabled={i === currentPage}
        style={{
          margin: "0 0.15rem",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: i === currentPage ? "#eee" : "white",
          cursor: i === currentPage ? "default" : "pointer"
        }}
      >
        {i + 1}
      </button>
    );
  }

  return (
    <div
      style={{
        marginTop: "0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.25rem",
        flexWrap: "wrap"
      }}
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 0}
        style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "white",
          cursor: currentPage === 0 ? "not-allowed" : "pointer"
        }}
      >
        Prev
      </button>

      {pageButtons}

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          background: "white",
          cursor:
            currentPage >= totalPages - 1 ? "not-allowed" : "pointer"
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
