import React, { useState } from "react";
import { Button, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchSidebar from "../SearchSideBar/SearchSidebar";
import NotificationIcon from "../../../assets/icons/NotificationIcon";
import Search from "../../../assets/icons/Search";
import Logout from "../../../assets/icons/Logout";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [show, setShow] = useState(false);
  const { userInformation } = useSelector((state) => state.authentication);
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
        <span className="d-none d-md-flex">Search User</span> <Search />
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
        <Button className="btn-secondary d-md-flex d-none me-md-2" size="lg">
          <NotificationIcon />
        </Button>
        <Button className="btn-secondary d-md-flex d-none me-md-2" size="lg">
          <Logout />
        </Button>
        <button
          style={{
            backgroundColor: userInformation.bgColor,
          }}
          className={
            "btn-secondary d-md-flex d-none justify-content-center align-items-center text-center " +
            styles["profile-btn"]
          }
        >
          {userInformation.name[0]}
        </button>

        <Nav className="ms-auto py-1 py-md-0 d-md-none">
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item onClick="">Notifications</NavDropdown.Item>
            <NavDropdown.Item onClick="">Logout</NavDropdown.Item>
            <NavDropdown.Item onClick="">Profile</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
