import { PageMetaData, SelectFormInput } from "@/components";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { BsBookmarkHeart } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";


const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBooking, setTotalBooking] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);


const handleView = (booking) => {
  setSelectedBooking(booking);
  setShowModal(true);
};


  const fetchBookings = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/v1/shops/bookings?page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data && data.success) {
          setBookings(data.data);
          setTotalBooking(data.total);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchBookings(currentPage);
  }, [fetchBookings, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const startEntry = bookings.length > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endEntry = Math.min(currentPage * 10, totalBooking);

  return (
    <>
      <PageMetaData title="Agent Bookings" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsBookmarkHeart className=" fa-fw me-1" />
                Bookings
              </h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card className="border">
                <CardHeader className="border-bottom">
                  <h5 className="card-header-title">
                    Bookings
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {totalBooking} Rooms
                    </span>
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="row g-3 align-items-center justify-content-between mb-3">
                    <div className="col-md-8">
                      <form className="rounded position-relative">
                        <input
                          className="form-control pe-5"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button
                          className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="button"
                        >
                          <FaSearch className="mb-1" />
                        </button>
                      </form>
                    </div>
                    <Col md={3}>
                      <form>
                        <SelectFormInput
                          className="form-select js-choice"
                          aria-label=".form-select-sm"
                        >
                          <option value={-1}>Sort by</option>
                          <option>Free</option>
                          <option>Newest</option>
                          <option>Oldest</option>
                        </SelectFormInput>
                      </form>
                    </Col>
                  </div>
                  <div className="table-responsive border-0">
                    <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            Name
                          </th>
                          <th scope="col" className="border-0">
                            Requirements
                          </th>
                          <th scope="col" className="border-0">
                            Date
                          </th>
                          <th scope="col" className="border-0">
                            Status
                          </th>
                          <th scope="col" className="border-0">
                            Payment
                          </th>
                          <th scope="col" className="border-0 rounded-end">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border-top-0">
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking, idx) => (
                            <tr key={booking._id || idx}>
                              <td>
                                <h6 className="mb-0">
                                  {(currentPage - 1) * 10 + idx + 1}
                                </h6>
                              </td>
                              <td>
                                <h6 className="mb-0">
                                  <Link to="">{booking.roomName}</Link>
                                </h6>
                              </td>
                              <td>{booking.additionalInfo || "N/A"}</td>
                              <td>
                                <h6 className="mb-0 fw-light">
                                  {booking.checkInDate}
                                </h6>
                              </td>
                              <td>
                                <div
                                  className={clsx(
                                    "badge",
                                    booking.status === "cancel"
                                      ? "bg-danger"
                                      : booking.status === "booked"
                                      ? "bg-success"
                                      : "bg-warning"
                                  )}
                                >
                                  {booking.status}
                                </div>
                              </td>
                              <td>
                                <div
                                  className={clsx(
                                    "badge bg-opacity-10",
                                    booking.paymentStatus === "paid"
                                      ? "bg-success text-success"
                                      : "bg-warning text-warning"
                                  )}
                                >
                                  {booking.paymentStatus}
                                </div>
                              </td>
                              <td>
                                <Link
                                onClick={() => handleView(booking)}
                                  to=""
                                  className="btn btn-sm btn-light mb-0"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-sm-0 text-center text-sm-start">
                      Showing {startEntry} to {endEntry} of {totalBooking}{" "}
                      entries
                    </p>
                    <nav
                      className="mb-sm-0 d-flex justify-content-center"
                      aria-label="navigation"
                    >
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
    <Modal.Title>Booking Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedBooking && (
      <>
        <p style={{color:"black"}}><strong>Room:</strong> {selectedBooking.roomName}</p>
        <p style={{color:"black"}}><strong>Check In:</strong> {selectedBooking.checkInDate}</p>
        <p style={{color:"black"}}><strong>Status:</strong> {selectedBooking.status == "booked" ? <span style={{color:"green"}}> Booked </span> : <span style={{color:"red"}}>Cancelled</span>}</p>
        <p style={{color:"black"}}><strong>Payment:</strong> {selectedBooking.paymentStatus == "paid" ? <span style={{color:"green"}}> paid </span> : <span style={{color:"red"}}>Not Paid</span>}</p>
        <p style={{color:"black"}}><strong>Requirements:</strong> {selectedBooking.additionalInfo || "N/A"}</p>
      </>
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

export default Bookings;
