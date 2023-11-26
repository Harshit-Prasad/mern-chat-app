import React from "react";

export default function NotificationMark({
  condition,
  position,
  size,
  backgroundColor,
}) {
  if (!condition) return;
  return (
    <span
      className={`position-absolute ${position}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderRadius: "50%",
        transform: "translateX(50%)",
      }}
    ></span>
  );
}
