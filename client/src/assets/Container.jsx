import React from "react";

export default function Container({ children }) {
  return (
    <div
      className="position-relative"
      style={{ width: "20px", height: "20px" }}
    >
      {children}
    </div>
  );
}
