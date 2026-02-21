import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FaSearch } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { formatLabel } from "../../../../utils/utils";
import { Modal, Button } from "react-bootstrap";
import { API_BASE_URL } from "../../../../config/env";

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBooking, setTotalBooking] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const token = localStorage.getItem("token");

  const fetchBookings = useCallback(
    async (page, search = "", sort = "", filter = "") => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: search,
          sort: sort,
          filter: filter,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/v1/shops/bookings?${queryParams.toString()}`,
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
    const delayDebounceFn = setTimeout(() => {
      fetchBookings(1, searchTerm, sortBy, "upcoming");
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, sortBy, fetchBookings]);

  useEffect(() => {
    fetchBookings(currentPage, searchTerm, sortBy, "upcoming");
  }, [currentPage, fetchBookings]);

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
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <div className="d-sm-flex justify-content-between align-items-center">
          <h5 className="mb-2 mb-sm-0">Upcoming Bookings</h5>
          <Link to="/agent/bookings" className="btn btn-sm btn-primary mb-0">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardBody>
        <Row className="g-3 align-items-center justify-content-between mb-3">
          <Col md={8}>
            <div className="rounded position-relative">
              <input
                className="form-control pe-5"
                type="search"
                placeholder="Search by room name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                type="button"
              >
                <FaSearch />
              </button>
            </div>
          </Col>
          <Col md={3}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </Col>
        </Row>
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
                {/* <th scope="col" className="border-0">
                  Requirements
                </th> */}
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
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No upcoming bookings found
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
                    {/* <td>{booking.additionalInfo || "N/A"}</td> */}
                    <td>
                      <h6 className="mb-0 fw-light">{booking.checkInDate}</h6>
                    </td>
                    <td>
                      <div
                        className={clsx(
                          "badge",
                          booking.status === "cancelled"
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
                        {/* {booking.paymentStatus} */}
                        {booking.paymentStatus
                          ? formatLabel(booking.paymentStatus)
                          : "Unavailable"}
                      </div>
                    </td>
                    <td>
                      {/* <Link
                        to={`/agent/room-detail/${booking?.roomId}`}
                        className="btn btn-sm btn-light mb-0"
                      >
                        View
                      </Link> */}
                      <Link
                        to=""
                        className="btn btn-sm btn-light mb-0"
                        onClick={() => handleView(booking)}
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
            Showing {startEntry} to {endEntry} of {totalBooking} entries
          </p>
          <nav
            className="mb-sm-0 d-flex justify-content-center"
            aria-label="navigation"
          >
            <ul className="pagination pagination-sm pagination-primary-soft mb-0">
              <li
                className={clsx("page-item", { disabled: currentPage === 1 })}
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          {/* <Modal.Title className="fw-bold">Booking Details</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>
          {selectedBooking && (
            <div className="p-2">
              {/* Room Header */}
              <div className="mb-4">
                <h4 className="fw-bold mb-1">{selectedBooking.roomName}</h4>
              </div>

              {/* Status + Payment Row */}
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <span
                  className={`badge px-3 py-2 ${
                    selectedBooking.status === "booked"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {selectedBooking.status.toUpperCase()}
                </span>

                <span
                  className={`badge px-3 py-2 ${
                    selectedBooking.paymentStatus === "paid"
                      ? "bg-primary"
                      : "bg-warning text-dark"
                  }`}
                >
                  {selectedBooking.paymentStatus.toUpperCase()}
                </span>
              </div>
              {console.log("selectedBooking-------------", selectedBooking)}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Customer Details</h6>

                  <div className="row mb-2">
                    <div className="col-6 ">Customer name</div>
                    <div className="col-6 text-end">
                      {selectedBooking.customer?.name ?? ""}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-6 ">Email</div>
                    <div className="col-6 text-end">
                      {selectedBooking.customer?.email ?? ""}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-6 ">Contact Number</div>
                    <div className="col-6 text-end">
                      {selectedBooking.customer?.contactNumber ?? "Unavailable"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info Card */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-6 ">Booking ID</div>
                    <div className="col-6 text-end fw-semibold">
                      #{selectedBooking._id.slice(-6)}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6 ">Check In - Out</div>
                    <div className="col-6 text-end fw-semibold">
                      {selectedBooking.checkInDate} →{" "}
                      {selectedBooking.checkOutDate}
                    </div>
                  </div>

                  {/* <div className="row mb-2">
                    <div className="col-6 ">Room Requirements</div>
                    <div className="col-6 text-end">
                      {selectedBooking.additionalInfo || "N/A"}
                    </div>
                  </div> */}

                  <div className="row mb-2">
                    <div className="col-6 ">Total Amount</div>
                    <div className="col-6 text-end fw-bold text-success">
                      ₹ {selectedBooking.totalAmount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Payment Details</h6>

                  <div className="row mb-2">
                    <div className="col-6 ">Payment ID</div>
                    <div className="col-6 text-end">
                      #{selectedBooking.paymentDetails?._id.slice(-6) || "N/A"}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 ">Source</div>
                    <div className="col-6 text-end">
                      {selectedBooking.utm?.source || "Organic"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default UpcomingBookings;
