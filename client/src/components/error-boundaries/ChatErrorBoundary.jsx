import React from "react";
import { Link } from "react-router-dom";
import "../../styles/links.css";

export default function ChatErrorBoundary() {
  return (
    <div className="link-container w-100 vh-100 d-flex justify-content-center align-items-center flex-column">
      <h1>Something went wrong!</h1>
      <h2>Try Again!</h2>
      <Link to="/">TO HOME</Link>
    </div>
  );
}
