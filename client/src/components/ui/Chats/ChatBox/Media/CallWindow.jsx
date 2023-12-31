import React from "react";

export default function CallWindow({ children, display }) {
  if (!display) return;

  return (
    <div
      className={`h-100 w-100 d-${
        display ? "flex" : "none"
      } justify-content-center align-items-center flex-column`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
      }}
    >
      {children}
    </div>
  );
}
