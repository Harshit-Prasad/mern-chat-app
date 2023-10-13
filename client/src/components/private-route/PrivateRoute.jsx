import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { userInformation } = useSelector((state) => state.authentication);
  return userInformation ? <Outlet /> : <Navigate to="/" />;
}
