import React, { useState } from "react";
import { useLazyAllUsersQuery } from "../../../slices/api/userSlice";
import { Button, Form, Offcanvas } from "react-bootstrap";
import Skeleton from "../Skeleton/Skeleton";
import SearchIcon from "../../../assets/icons/SearchIcon";
import SearchResults from "./SearchResults";

export default function SearchSidebar({ show, handleClose }) {
  const [getAllUsers, { isLoading }] = useLazyAllUsersQuery();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSearch("");
      const response = await getAllUsers(search).unwrap();
      console.log(response);
      setSearchResult(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Search User</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Form onSubmit={handleSubmit} className="d-flex" style={{ gap: "1em" }}>
          <Form.Control
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
          />
          <Button disabled={isLoading} type="submit" className="btn-secondary">
            <SearchIcon />
          </Button>
        </Form>
        <div className="pt-2" style={{ backgroundColor: "transparent" }}>
          {isLoading ? (
            <Skeleton length={7} />
          ) : (
            <SearchResults searchResult={searchResult} />
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}