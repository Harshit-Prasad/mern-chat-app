import React from "react";

export default function Avatar({ name, bgColor, size }) {
  const [identifier] = name;

  return (
    <div
      style={{
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        backgroundColor: bgColor,
      }}
      className="d-flex justify-content-center align-items-center text-center"
    >
      {identifier}
    </div>
  );
}
