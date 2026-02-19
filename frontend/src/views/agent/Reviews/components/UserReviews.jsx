import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import ReviewCard from "./ReviewCard";
import { Fragment, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 5,
  });
  const [ratingFilter, setRatingFilter] = useState("");

  const fetchReviews = useCallback(async (page = 1, rating = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/shops/reviews`,
        {
          params: { page, limit: 5, rating },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(pagination.currentPage, ratingFilter);
  }, [pagination.currentPage, ratingFilter, fetchReviews]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    setRatingFilter(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter
  };

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <h5 className="card-header-title">User Reviews</h5>
        <div className="d-flex align-items-center">
          <span className="me-2 small text-nowrap">Filter by Rating:</span>
          <Form.Select
            size="sm"
            value={ratingFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Form.Select>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <Fragment key={review._id}>
              <ReviewCard review={review} />
              {reviews.length - 1 !== idx && <hr />}
            </Fragment>
          ))
        ) : (
          <div className="text-center p-4 text-muted">No reviews found.</div>
        )}
      </CardBody>

      <CardFooter className="pt-0">
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
          <p className="mb-sm-0 text-center text-sm-start">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} entries
          </p>

          {pagination.totalPages > 1 && (
            <nav
              className="mb-sm-0 d-flex justify-content-center"
              aria-label="navigation"
            >
              <ul className="pagination pagination-sm pagination-primary-soft mb-0">
                <li
                  className={`page-item ${
                    pagination.currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>

                {[...Array(pagination.totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      pagination.currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    pagination.currentPage === pagination.totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserReviews;
