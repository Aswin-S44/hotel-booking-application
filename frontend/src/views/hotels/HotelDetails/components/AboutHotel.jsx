import { useToggle } from "@/hooks";
import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPatchCheckFill, BsShieldFillCheck } from "react-icons/bs";
import {
  FaCheckCircle,
  FaConciergeBell,
  FaSwimmingPool,
  FaVolumeUp,
} from "react-icons/fa";
import { FaAngleDown, FaAngleUp, FaSnowflake, FaWifi } from "react-icons/fa6";
import CustomerReview from "./CustomerReview";
import HotelPolicies from "./HotelPolicies";
import PriceOverView from "./PriceOverView";
import RoomOptions from "./RoomOptions";
import { useParams } from "react-router-dom";
import axios from "axios";

const AboutHotel = ({ hotelDetails, shoRoomOptions = true, propertyId }) => {
  const { isOpen, toggle } = useToggle();
  const { id } = useParams();
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/v1/customer/reviews-by-property-id/${id}`
      );
      setReviewsData(res.data);
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

  return (
    <section className="pt-0">
      <Container data-sticky-container>
        <Row className="g-4 g-xl-5">
          <Col xl={7} className="order-1">
            <div className="vstack gap-5">
              <Card className="bg-transparent">
                <CardHeader className="border-bottom bg-transparent px-0 pt-0">
                  <h3 className="mb-0">About This Hotel </h3>
                </CardHeader>
                <CardBody className="pt-4 p-0">
                  <h5 className="fw-light mb-4">Main Highlights</h5>
                  <div className="hstack gap-3 mb-3">
                    <OverlayTrigger overlay={<Tooltip>Free Wifi</Tooltip>}>
                      <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                        <FaWifi size={24} />
                      </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Swimming Pool</Tooltip>}>
                      <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                        <FaSwimmingPool size={24} />
                      </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Central AC</Tooltip>}>
                      <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                        <FaSnowflake size={24} />
                      </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Free Service</Tooltip>}>
                      <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                        <FaConciergeBell />
                      </div>
                    </OverlayTrigger>
                  </div>
                  <p className="mb-3">{hotelDetails?.about}</p>

                  <h5 className="fw-light mb-2">Advantages</h5>
                </CardBody>
              </Card>
              <Card className="bg-transparent">
                <CardHeader className="border-bottom bg-transparent px-0 pt-0">
                  <h3 className="card-title mb-0">Amenities</h3>
                </CardHeader>

                <CardBody className="pt-4 p-0">
                  <Row className="g-4">
                    {hotelDetails?.amenities?.length > 0 &&
                      hotelDetails.amenities.map((amenity, idx) => (
                        <Col sm={6} key={idx}>
                          <ul className="list-group list-group-borderless mt-2 mb-0">
                            <li className="list-group-item pb-0 items-center">
                              <FaCheckCircle className="text-success me-2" />
                              {amenity}
                            </li>
                          </ul>
                        </Col>
                      ))}
                  </Row>
                </CardBody>
              </Card>

              {shoRoomOptions && (
                <RoomOptions
                  rooms={hotelDetails?.rooms}
                  features={hotelDetails?.amenities ?? []}
                />
              )}

              <CustomerReview
                hotelDetails={hotelDetails}
                propertyId={propertyId}
                reviewsData={reviewsData}
              />

              <HotelPolicies />
            </div>
          </Col>
          <Col as={"aside"} xl={5} className="order-xl-2">
            <PriceOverView
              rate={hotelDetails?.rate ?? 0}
              rating={hotelDetails?.rating ?? 0}
              rooms={hotelDetails?.rooms}
              amenities={hotelDetails?.amenities ?? []}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default AboutHotel;
