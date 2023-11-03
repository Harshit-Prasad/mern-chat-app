import React, { Children } from "react";

export default function MediaCallOverlay({ children, display }) {
  if (!display) return;

  return (
    <div
      className={`h-100 w-100 d-${
        display ? "flex" : "none"
      } justify-content-center align-items-center`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
}
