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
          `http://localhost:5000/api/v1/shops/bookings?${queryParams.toString()}`,
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
                    <td>{booking.additionalInfo || "N/A"}</td>
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
                        {booking.paymentStatus}
                      </div>
                    </td>
                    <td>
                      {/* <Link
                        to={`/agent/room-detail/${booking?.roomId}`}
                        className="btn btn-sm btn-light mb-0"
                      >
                        View
                      </Link> */}
                      <Link to="" className="btn btn-sm btn-light mb-0">
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
    </Card>
  );
};

export default UpcomingBookings;
