import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loader({ size }) {
  return (
    <div className="d-flex justify-content-center align-items-center mt-1">
      <Spinner size={size} />
    </div>
  );
}
