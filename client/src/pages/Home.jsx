import React from "react";
import { useSelector } from "react-redux";
import Container from "../components/layouts/Container/Container";
import Header from "../components/layouts/Header/Header";
import Main from "../components/layouts/Main/Main";
import Footer from "../components/layouts/Footer/Footer";
import Forms from "../components/ui/Form/Forms/Forms";
import Card from "../components/ui/Card/Card";

export default function Home() {
  const { userInformation } = useSelector((state) => state.authentication);

  return (
    <Container>
      <Header>
        <h1 className="display-3 text-center">Chit-Chat</h1>
      </Header>
      <Main>
        <div className="h-100 d-flex justify-content-center align-items-center flex-column m-md-0">
          <div
            style={{ borderRadius: "1em" }}
            className="glass p-lg-2 p-2 m-2 d-flex justify-content-center align-items-center flex-column"
          >
            {userInformation ? <Card /> : <Forms />}
          </div>
        </div>
      </Main>
      <Footer />
    </Container>
  );
}
