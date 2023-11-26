import React from "react";
import Container from "../Container";

export default function NotificationIcon({ children }) {
  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-bell-fill position-absolute w-100 h-100 top-0 start-0"
        viewBox="0 0 16 16"
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
      </svg>
      {children}
    </Container>
  );
}
