import React, { useCallback, useEffect, useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchSidebar from "../SearchSideBar/SearchSidebar";
import NotificationSideBar from "../NotificationSideBar/NotificationSideBar";
import Avatar from "../Avatar/Avatar";
import ToolTip from "../ToolTip/ToolTip";
import NotificationMark from "../NotificationMark/NotificationMark";
import NotificationIcon from "../../../assets/icons/NotificationIcon";
import Search from "../../../assets/icons/Search";
import Logout from "../../../assets/icons/Logout";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { userInformation } = useSelector((state) => state.authentication);
  const { notification } = useSelector((state) => state.notification);

  const handleShowSearch = useCallback(() => setShowSearch(true), [showSearch]);
  const handleCloseSearch = useCallback(
    () => setShowSearch(false),
    [showSearch]
  );
  const handleOpenNotification = useCallback(
    () => setShowNotification(true),
    [showNotification]
  );
  const handleCloseNotification = useCallback(
    () => setShowNotification(false),
    [showNotification]
  );
  return (
    <Navbar
      expand="md"
      className="d-flex mx-1 mx-md-5 justify-content-between align-items-center"
    >
      <Button
        onClick={handleShowSearch}
        style={{ gap: "1em" }}
        className="d-flex justify-content-center align-items-center p-2 btn-secondary"
      >
        <span className="d-none d-md-flex">Search User</span> <Search />
      </Button>

      <SearchSidebar
        showSearch={showSearch}
        handleCloseSearch={handleCloseSearch}
      />

      <Navbar.Brand>
        <Link className="text-decoration-none display-5" to="/">
          Converse
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse style={{ borderRadius: "5px" }} id="basic-navbar-nav">
        <div className={`mt-2 mt-md-0 p-1 p-md-0 ${styles["btn-container"]}`}>
          <Button
            onClick={handleOpenNotification}
            className="btn-secondary position-relative d-flex me-md-2"
            size="lg"
          >
            <NotificationIcon>
              <NotificationMark
                condition={notification.length}
                size="5px"
                backgroundColor="red"
              />
            </NotificationIcon>
          </Button>

          <NotificationSideBar
            handleCloseNotification={handleCloseNotification}
            showNotification={showNotification}
          />

          <ToolTip tooltip="Logout" placement="bottom">
            <Button className="btn-secondary d-flex me-md-2" size="lg">
              <Logout />
            </Button>
          </ToolTip>
          <ToolTip tooltip={userInformation.name} placement="bottom">
            <Button
              style={{ borderRadius: "50%" }}
              className="btn-secondary p-0 m-0"
            >
              <Avatar
                name={userInformation.name}
                bgColor={userInformation.bgColor}
                size={40}
              />
            </Button>
          </ToolTip>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
