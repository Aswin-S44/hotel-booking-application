import React, { useEffect, useState, useCallback } from "react";
import { PageMetaData, SelectFormInput } from "@/components";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Modal,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { BsBookmarkHeart } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import NotFound from "../../../components/NotFound/NotFound";
import { API_BASE_URL } from "../../../config/env";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [isBlocked, setIsBlocked] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem("token");
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: limit,
        sort: sort,
        ...(searchTerm && { search: searchTerm }),
        ...(isBlocked !== "" && { isBlocked: isBlocked }),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/shops/users?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.success) {
        setUsers(data.data);
        setTotalUsers(data.total);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [token, currentPage, sort, searchTerm, isBlocked]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handleBlockFilter = (e) => {
    setIsBlocked(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const renderPagination = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li
          key={i}
          className={clsx("page-item", { active: i === currentPage })}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return items;
  };

  const startEntry = users.length > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endEntry = Math.min(currentPage * limit, totalUsers);

  return (
    <>
      <PageMetaData title="All Customers" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsBookmarkHeart className=" fa-fw me-1" />
                All Users
              </h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card className="border">
                <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-header-title mb-0">
                    Users
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {totalUsers} Users
                    </span>
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="row g-3 align-items-center justify-content-between mb-3">
                    <div className="col-md-5">
                      <div className="rounded position-relative">
                        <input
                          className="form-control pe-5"
                          type="search"
                          placeholder="Search by name or email"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <button
                          className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="button"
                        >
                          <FaSearch className="mb-1" />
                        </button>
                      </div>
                    </div>
                    <Col md={3}>
                      <select
                        className="form-select"
                        value={isBlocked}
                        onChange={handleBlockFilter}
                      >
                        <option value="">All Status</option>
                        <option value="false">Active</option>
                        <option value="true">Blocked</option>
                      </select>
                    </Col>
                    <Col md={3}>
                      <select
                        className="form-select"
                        value={sort}
                        onChange={handleSortChange}
                      >
                        <option value="-createdAt">Newest</option>
                        <option value="createdAt">Oldest</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="-name">Name (Z-A)</option>
                      </select>
                    </Col>
                  </div>

                  {!loading && users.length === 0 ? (
                    <NotFound
                      title={"No Users found!"}
                      description={"No matching users found for your criteria."}
                    />
                  ) : (
                    <div className="table-responsive border-0">
                      <table className="table align-middle p-4 mb-0 table-hover">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" className="border-0 rounded-start">
                              #
                            </th>
                            <th scope="col" className="border-0">
                              Name
                            </th>
                            <th scope="col" className="border-0">
                              Email
                            </th>
                            <th scope="col" className="border-0">
                              Login Method
                            </th>
                            <th scope="col" className="border-0">
                              Status
                            </th>
                            <th scope="col" className="border-0 rounded-end">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="border-top-0">
                          {loading ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                Loading...
                              </td>
                            </tr>
                          ) : (
                            users.map((user, idx) => (
                              <tr key={user._id}>
                                <td>{(currentPage - 1) * limit + idx + 1}</td>
                                <td>
                                  <h6 className="mb-0">{user.name}</h6>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    {user.provider}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={clsx(
                                      "badge",
                                      user.isBlocked
                                        ? "bg-danger"
                                        : "bg-success"
                                    )}
                                  >
                                    {user.isBlocked ? "Blocked" : "Active"}
                                  </span>
                                </td>
                                <td>
                                  <Button
                                    variant="light"
                                    size="sm"
                                    onClick={() => handleView(user)}
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardBody>
                <CardFooter className="pt-0">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-sm-0 text-center text-sm-start">
                      Showing {startEntry} to {endEntry} of {totalUsers} entries
                    </p>
                    <nav className="mb-sm-0 d-flex justify-content-center">
                      <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === 1,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Prev
                          </button>
                        </li>
                        {renderPagination()}
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === totalPages,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="text-center">
              <img
                src={selectedUser.avatar || "https://via.placeholder.com/100"}
                alt="avatar"
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <h5>{selectedUser.name}</h5>
              <p className="text-muted">{selectedUser.email}</p>
              <hr />
              <div className="text-start">
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Provider:</strong> {selectedUser.provider}
                </p>
                <p>
                  <strong>Contact:</strong>{" "}
                  {selectedUser.contactNumber || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {selectedUser.location || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Users;
