import React, { useState } from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchSidebar from "../SearchSideBar/SearchSidebar";
import NotificationIcon from "../../../assets/icons/NotificationIcon";
import SearchIcon from "../../../assets/icons/SearchIcon";

export default function Navigation() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <Navbar
      expand="md"
      className="d-flex mx-1 mx-md-5 justify-content-between align-items-center"
    >
      <Button
        onClick={handleShow}
        style={{ gap: "1em" }}
        className="d-flex justify-content-center align-items-center p-2 btn-secondary"
      >
        <span className="d-none d-md-flex">Search User</span> <SearchIcon />
      </Button>

      {/* -- imported -- */}
      <SearchSidebar show={show} handleClose={handleClose} />
      {/* -- imported -- */}

      <Navbar.Brand>
        <Link className="text-decoration-none display-5" to="/">
          Chit-Chat
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="mt-2 mt-md-0" id="basic-navbar-nav">
        <Button className="btn-secondary me-md-1" size="lg">
          <NotificationIcon />
        </Button>
        <Nav className="ms-auto py-1 py-md-0">
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item onClick="">Logout</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick="">Profile</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
