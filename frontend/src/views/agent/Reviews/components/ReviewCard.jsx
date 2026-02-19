import { GlightBox } from "@/components";
import { useToggle } from "@/hooks";
import { Button, Col, Collapse, Image, Row, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical, BsTrash3, BsReply } from "react-icons/bs";
import { FaPaperPlane, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { DEFAULT_AVATAR_IMAGE } from "../../../../constants/images";
import { format } from "date-fns";
import { useState } from "react";

const ReviewCard = ({ review = {}, onDelete, onReply }) => {
  const { isOpen, toggle } = useToggle();
  const [replyText, setReplyText] = useState(review?.reply || "");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(review._id, replyText);
    toggle();
  };

  return (
    <div className="bg-light rounded p-3">
      <div className="d-sm-flex justify-content-between">
        <div className="d-sm-flex align-items-center mb-3">
          <Image
            className="avatar avatar-md rounded-circle float-start me-3"
            src={review?.fromId?.avatar ?? DEFAULT_AVATAR_IMAGE}
            alt="avatar"
          />
          <div>
            <h6 className="m-0">{review?.fromId?.firstName ?? "User"}</h6>
            <span className="me-3 small">
              {review?.createdAt &&
                format(new Date(review.createdAt), "dd MMM yyyy, hh:mm a")}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <ul className="list-inline mb-0 me-3">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="list-inline-item me-1">
                <FaStar
                  size={16}
                  className={
                    i < Math.floor(review?.rating || 0)
                      ? "text-warning"
                      : "text-secondary"
                  }
                />
              </li>
            ))}
          </ul>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="button"
              className="btn btn-sm btn-light border-0 p-0 arrow-none bg-transparent"
            >
              <BsThreeDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu className="min-w-auto shadow">
              <Dropdown.Item
                className="text-danger d-flex align-items-center"
                onClick={() => onDelete(review._id)}
              >
                <BsTrash3 className="me-2" /> Delete review
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <h6 className="fw-normal mt-2">
        <span className="text-body">Review on:&nbsp;</span>
        {review?.propertyId?.listingName ?? ""}
      </h6>
      <p>{review?.feedback}</p>

      {/* Review Images */}
      {review.reviewImages && review.reviewImages.length > 0 && (
        <Row className="g-2 mb-3">
          {review.reviewImages.map((image, idx) => (
            <Col key={idx} xs={4} sm={3} lg={2}>
              <GlightBox image={image}>
                <Image src={image} className="rounded w-100" />
              </GlightBox>
            </Col>
          ))}
        </Row>
      )}

      {/* Display Existing Reply */}
      {review.reply && (
        <div className="bg-white p-3 rounded border-start border-primary border-4 mb-3">
          <h6 className="mb-1 text-primary small">Your Response:</h6>
          <p className="mb-0 small">{review.reply}</p>
        </div>
      )}

      <div className="mt-3">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={toggle}
          className="items-center"
        >
          <BsReply className="me-1" /> {review.reply ? "Edit Reply" : "Reply"}
        </Button>

        <Collapse in={isOpen}>
          <div>
            <div className="d-flex mt-3">
              <textarea
                className="form-control mb-0"
                placeholder="Write your response..."
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                variant="primary"
                size="sm"
                className="ms-2 px-4 mb-0 flex-shrink-0"
                onClick={handleReplySubmit}
              >
                <FaPaperPlane />
              </Button>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default ReviewCard;
