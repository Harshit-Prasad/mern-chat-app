import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

export default function Forms() {
  const [key, setKey] = useState("signup");

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-2 mb-md-3"
    >
      <Tab eventKey="login" title="Login">
        <Login />
      </Tab>
      <Tab eventKey="signup" title="Signup">
        <Signup />
      </Tab>
    </Tabs>
  );
}
