import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div className="d-flex w-100 justify-content-center align-items-center mt-1">
      <Spinner />
    </div>
  );
}
