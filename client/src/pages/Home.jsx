import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Container from "../components/layouts/Container/Container";
import Header from "../components/layouts/Header/Header";
import Main from "../components/layouts/Main/Main";
import Login from "../components/ui/Form/Login/Login";
import Signup from "../components/ui/Form/Signup/Signup";
import Footer from "../components/layouts/Footer/Footer";

export default function Home() {
  const [key, setKey] = useState("signup");
  return (
    <Container>
      <Header />
      <Main>
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
      </Main>
      <Footer />
    </Container>
  );
}
