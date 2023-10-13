import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { removeCredentials } from "../../../slices/state/authenticationSlice";

export default function Card() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={`p-1 p-md-3`}>
      <h1 className="display-2 text-center">Welcome Back!</h1>
      <div
        style={{ gap: "1em" }}
        className="d-flex justify-content-center m-1 mt-md-3"
      >
        <Button onClick={() => navigate("/chat")} variant="primary">
          Chat
        </Button>
        <Button
          onClick={() => dispatch(removeCredentials())}
          variant="secondary"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
