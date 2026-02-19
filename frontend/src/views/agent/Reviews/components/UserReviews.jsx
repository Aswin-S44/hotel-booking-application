import { Card, CardBody, CardFooter, CardHeader, Form } from "react-bootstrap";
import ReviewCard from "./ReviewCard";
import { Fragment, useEffect, useState, useCallback } from "react";
import axios from "axios";
import NotFound from "../../../../components/NotFound/NotFound";
import { ToastContainer, toast } from "react-toastify";

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

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/v1/shops/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleReplyReview = async (reviewId, replyText) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/api/v1/shops/reviews/${reviewId}/reply`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Reply submitted");
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, reply: replyText } : r))
        );
      }
    } catch (error) {
      toast.error("Failed to submit reply");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    setRatingFilter(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  if (!loading && reviews.length === 0) {
    return (
      <NotFound
        title={"No Reviews found!"}
        description={"No reviews available."}
      />
    );
  }

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <h5 className="card-header-title">User Reviews</h5>
        <div className="d-flex align-items-center">
          <span className="me-2 small text-nowrap">Filter:</span>
          <Form.Select
            size="sm"
            value={ratingFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Stars</option>
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </Form.Select>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          reviews.map((review, idx) => (
            <Fragment key={review._id}>
              <ReviewCard
                review={review}
                onDelete={handleDeleteReview}
                onReply={handleReplyReview}
              />
              {reviews.length - 1 !== idx && <hr />}
            </Fragment>
          ))
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
            <nav className="mb-sm-0 d-flex justify-content-center">
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
      <ToastContainer />
    </Card>
  );
};

export default UserReviews;
