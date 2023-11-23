import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLazyAllUsersQuery } from "../../../slices/api/userSlice";
import { Button, Form, Offcanvas } from "react-bootstrap";
import Skeleton from "../Skeleton/Skeleton";
import Search from "../../../assets/icons/Search";
import SearchResults from "./SearchResults";

export default function SearchSidebar({ showSearch, handleCloseSearch }) {
  const [getAllUsers, { isLoading }] = useLazyAllUsersQuery();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSearch("");
      const response = await getAllUsers(search).unwrap();
      setSearchResult(response);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Offcanvas show={showSearch} onHide={handleCloseSearch}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Search User</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          backgroundColor: "transparent",
        }}
        className="py-0"
      >
        <Form
          onSubmit={handleSubmit}
          className="d-flex justify-content-between"
          style={{ gap: "1em" }}
        >
          <Form.Group controlId="search">
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              required={true}
              placeholder="Search"
            />
          </Form.Group>
          <Button disabled={isLoading} type="submit" className="btn-secondary">
            <Search />
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
