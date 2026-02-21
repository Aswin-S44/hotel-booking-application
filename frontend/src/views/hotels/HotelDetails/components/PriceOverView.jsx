import { currency } from "@/states";
import { Button, Card, CardBody, Col, Image, Row } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sticky from "react-sticky-el";
import { useViewPort } from "@/hooks";
import offerImg4 from "@/assets/images/offer/04.jpg";

const PriceOverView = ({ rate, rating, rooms, amenities = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { width } = useViewPort();

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Sticky
      disabled={width <= 1199}
      topOffset={100}
      bottomOffset={0}
      boundaryElement="aside"
      hideOnBoundaryHit={false}
      stickyStyle={{
        transition: "0.2s all linear",
      }}
    >
      <Card as={CardBody} className="border">
        <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
          <div>
            <span>Price Start at</span>
            <h4 className="card-title mb-0">
              {currency}
              {rate}
            </h4>
          </div>
          <div>
            <h6 className="fw-normal mb-0">1 room per night</h6>
            <small>
              + {currency}
              {rate} taxes &amp; fees
            </small>
          </div>
        </div>
        <ul className="list-inline mb-2 items-center">
          <li className="list-inline-item me-1 h6 fw-light mb-0">
            <BsArrowRight className="me-2" />
            {rating}
          </li>

          {/* Full Stars */}
          {Array.from({ length: fullStars }).map((_, idx) => (
            <li className="list-inline-item me-1 small" key={`full-${idx}`}>
              <FaStar size={16} className="text-warning" />
            </li>
          ))}

          {/* Half Star */}
          {hasHalfStar && (
            <li className="list-inline-item me-1 small">
              <FaStarHalfAlt size={16} className="text-warning" />
            </li>
          )}

          {/* Empty Stars */}
          {Array.from({ length: emptyStars }).map((_, idx) => (
            <li className="list-inline-item me-1 small" key={`empty-${idx}`}>
              <FaRegStar size={16} className="text-warning" />
            </li>
          ))}
        </ul>

        <hr />
        {amenities?.length > 0 &&
          amenities.map((amn, index) => (
            <p className="h6 fw-light mb-4 items-center" key={index}>
              <BsArrowRight className=" me-2" />
              {amn}
            </p>
          ))}
        <div className="d-grid">
          <Button
            variant="primary-soft"
            size="lg"
            className="mb-0"
            onClick={() =>
              navigate(`/hotels/room-detail/${rooms[0]?._id}`, {
                state: { rooms },
              })
            }
          >
            View all Rooms
          </Button>
        </div>
      </Card>
      <div className="mt-4 d-none d-xl-block">
        <h4>Today's Best Deal</h4>
        <Card className="shadow rounded-3 overflow-hidden">
          <Row className="g-0 align-items-center">
            <Col sm={6} md={12} lg={6}>
              <Image src={offerImg4} className="card-img rounded-0" />
            </Col>
            <Col sm={6} md={12} lg={6}>
              <CardBody className="p-3">
                <h6 className="card-title">
                  <Link to="/offer-detail" className="stretched-link">
                    Travel Plan
                  </Link>
                </h6>
                <p className="mb-0">
                  Get up to {currency}10,000 for lifetime limits
                </p>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </div>
    </Sticky>
  );
};
export default PriceOverView;
