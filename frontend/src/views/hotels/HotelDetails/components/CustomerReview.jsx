import { SelectFormInput, TextAreaFormInput } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  ProgressBar,
  Row,
  CardHeader,
  CardBody,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsArrowRight } from "react-icons/bs";
import { FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import * as yup from "yup";
import avatar2 from "@/assets/images/avatar/02.jpg";
import avatarDefault from "@/assets/images/avatar/01.jpg"; // Added a default avatar
import AddReviewModal from "./AddReviewModal";
import { useAuthContext } from "@/states/useAuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DEFAULT_AVATAR_IMAGE } from "../../../../constants/images";
import { API_BASE_URL } from "../../../../config/env";

const CustomerReview = ({ hotelDetails, propertyId, reviewsData }) => {
  const { id } = useParams();
  const [newReviewData, setNewReviewData] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/customer/reviews-by-property-id/${propertyId}`
      );
      setNewReviewData(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewSchema = yup.object({
    review: yup.string().required("Please enter your review"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(reviewSchema),
  });

  const [showReview, setShowReview] = useState(false);
  const { user } = useAuthContext();

  const renderStars = (rating) => {
    return (
      <ul className="list-inline mb-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <li className="list-inline-item me-1" key={star}>
            {rating >= star ? (
              <FaStar size={18} className="text-warning" />
            ) : rating >= star - 0.5 ? (
              <FaStarHalfAlt size={18} className="text-warning" />
            ) : (
              <FaRegStar size={18} className="text-warning" />
            )}
          </li>
        ))}
      </ul>
    );
  };

  const summary = newReviewData?.summary;
  const reviews = newReviewData?.data || [];

  return (
    <Card className="bg-transparent">
      <CardHeader className="border-bottom bg-transparent px-0 pt-0">
        <h3 className="card-title mb-0">Customer Review</h3>
      </CardHeader>
      <CardBody className="pt-4 p-0">
        <Card className="bg-light p-4 mb-4">
          <Row className="g-4 align-items-center">
            <Col md={4}>
              <div className="text-center">
                <h2 className="mb-0">{summary?.averageRating || 0}</h2>
                <p className="mb-2">
                  Based on {summary?.totalReviews || 0} Reviews
                </p>
                {renderStars(summary?.averageRating || 0)}
              </div>
            </Col>
            <Col md={8}>
              <CardBody className="p-0">
                <Row className="gx-3 g-2 align-items-center">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const distribution = summary?.ratingDistribution[star];
                    return (
                      <Fragment key={star}>
                        <Col xs={9} sm={10}>
                          <ProgressBar
                            variant="warning"
                            now={distribution?.percentage || 0}
                            className="progress-sm bg-warning bg-opacity-15"
                          />
                        </Col>
                        <Col xs={3} sm={2} className="text-end">
                          <span className="h6 fw-light mb-0">
                            {distribution?.percentage || 0}%
                          </span>
                        </Col>
                      </Fragment>
                    );
                  })}
                </Row>
              </CardBody>
            </Col>
          </Row>
        </Card>
        <form onSubmit={handleSubmit(() => {})} className="mb-5">
          {/* <div className="form-control-bg-light mb-3">
            <SelectFormInput className="form-select js-choice">
              <option>★★★★★ (5/5)</option>
              <option>★★★★☆ (4/5)</option>
              <option>★★★☆☆ (3/5)</option>
              <option>★★☆☆☆ (2/5)</option>
              <option>★☆☆☆☆ (1/5)</option>
            </SelectFormInput>
          </div>
          <TextAreaFormInput name="review" containerClass="form-control-bg-light mb-3" control={control} rows={3} /> */}
        </form>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mb-0 items-center"
          onClick={() => setShowReview(true)}
        >
          Post review <BsArrowRight className="ms-2" />
        </Button>

        <AddReviewModal
          show={showReview}
          handleClose={() => {
            setShowReview(false);
            fetchReviews();
          }}
          roomId={hotelDetails?.rooms[0]?._id}
          userId={user?._id}
          propertyId={propertyId || id}
        />

        {reviews.map((review, idx) => (
          <div key={idx}>
            <div className="d-md-flex my-4">
              <div className="avatar avatar-lg me-3 flex-shrink-0">
                <Image
                  className="avatar-img rounded-circle"
                  src={review.fromId?.avatar || avatarDefault}
                  alt="avatar"
                />
              </div>
              {/* Added flex-grow-1 here to fix the alignment */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mt-1 mt-md-0">
                  <div>
                    <h6 className="me-3 mb-0">
                      {review.fromId?.name ||
                        review.fromId?.firstName +
                          " " +
                          review.fromId?.lastName}
                    </h6>
                    <ul className="nav nav-divider small mb-2">
                      <li className="nav-item">
                        Stayed{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </li>
                    </ul>
                  </div>
                  {/* Badge now pushed to the right */}
                  <div className="icon-md rounded text-bg-warning fs-6">
                    {review.rating}
                  </div>
                </div>
                <p className="mb-2">{review.feedback}</p>
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <Row className="g-4">
                    {review.reviewImages.map((img, i) => (
                      <Col key={i} xs={4} sm={3} lg={2}>
                        <Image src={img} className="rounded" />
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            </div>
            {review.reply && (
              <div className="my-4 ps-2 ps-md-3">
                <div className="d-md-flex p-3 bg-light rounded-3">
                  <img
                    className="avatar avatar-sm rounded-circle me-3"
                    src={DEFAULT_AVATAR_IMAGE}
                    alt="avatar"
                  />
                  <div className="mt-2 mt-md-0">
                    <h6 className="mb-1">Manager</h6>
                    <p className="mb-0">{review.reply}</p>
                  </div>
                </div>
              </div>
            )}
            <hr />
          </div>
        ))}

        <div className="text-center">
          <Button variant="primary-soft" className="mb-0">
            Load more
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
export default CustomerReview;
