import React from "react";
import { Spinner } from "react-bootstrap";

export default function PageLoader() {
  return (
    <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
      <Spinner />
    </div>
  );
}
