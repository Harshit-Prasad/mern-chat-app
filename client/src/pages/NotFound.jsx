import React from "react";
import { Link } from "react-router-dom";
import "../styles/links.css";

export default function NotFound() {
  return (
    <div className="link-container w-100 vh-100 d-flex justify-content-center align-items-center flex-column">
      <h1>
        <strong>404 | NOT FOUND!</strong>
      </h1>
      <p>Please check the url or use the navigation bar instead. </p>
      <Link to="/">To Home</Link>
    </div>
  );
}
