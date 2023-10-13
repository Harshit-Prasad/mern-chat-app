import React from "react";
import Container from "../components/layouts/Container/Container";
import Header from "../components/layouts/Header/Header";
import Main from "../components/layouts/Main/Main";
import Navigation from "../components/ui/Navigation/Navigation";
import Chats from "../components/ui/Chats/Chats";

export default function Chat() {
  return (
    <Container>
      <Header>
        <Navigation />
      </Header>
      <Main>
        <Chats />
      </Main>
    </Container>
  );
}
