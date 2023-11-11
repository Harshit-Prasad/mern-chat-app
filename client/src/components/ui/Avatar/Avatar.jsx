import React from "react";

export default function Avatar({ name, bgColor, size }) {
  const [identifier] = name;
  return (
    <div
      style={{
        fontSize: size / 3 + "px",
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        backgroundColor: bgColor,
        position: "relative",
      }}
      className="d-flex justify-content-center align-items-center text-center"
    >
      {identifier}
    </div>
  );
}
