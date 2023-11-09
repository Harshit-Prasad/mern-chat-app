import React from "react";

export default function Container({ children, full }) {
  return (
    <div
      className="position-relative"
      style={{ width: full ? "100%" : "20px", height: full ? "100%" : "20px" }}
    >
      {children}
    </div>
  );
}
