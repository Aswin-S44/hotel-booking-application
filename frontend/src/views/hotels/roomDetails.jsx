import { PageMetaData } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TopNavBar4 from "../tours/Grid/components/TopNavBar4";
import AvailabilityFilter from "./Grid/components/AvailabilityFilter";
import HotelGallery from "./HotelDetails/components/HotelGallery";
import AboutHotel from "./HotelDetails/components/AboutHotel";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaConciergeBell,
  FaSnowflake,
  FaSwimmingPool,
  FaWifi,
} from "react-icons/fa";
import CustomerReview from "./HotelDetails/components/CustomerReview";
import HotelPolicies from "./HotelDetails/components/HotelPolicies";
import PriceOverView from "./HotelDetails/components/PriceOverView";
import FooterWithLinks from "../../layouts/HelpLayout/FooterWithLinks";

const RoomExtraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchRoomDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/customer/rooms/${id}/all`
          );
          const result = await response.json();

          if (result && result.data) {
            setRoom(result.data);
          }
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      fetchRoomDetails();
    }
  }, [id]);

  if (loading) return null;

  const hotelDetails = {
    about: room?.property?.shortDescription,
    amenities: room?.property?.amenities ?? [],
    rate: room?.property?.basePrice,
    rating: room?.property?.starRating ?? 0,
    totalRooms: room?.property?.rooms?.length ?? 0,
    rooms: room?.property?.rooms ?? [],
  };

  const discountPercent = room?.discount || 0;
  const savedFilter = localStorage.getItem("searchData");
  const formValue = savedFilter ? JSON.parse(savedFilter) : null;
  const checkIn = formValue?.stayFor?.[0]
    ? new Date(formValue.stayFor[0])
    : null;
  const checkOut = formValue?.stayFor?.[1]
    ? new Date(formValue.stayFor[1])
    : null;
  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 1;
  const formatDate = (date) =>
    date
      ? `${date.getDate()} ${date.toLocaleString("default", {
          month: "long",
        })} ${date.getFullYear()}`
      : "-";

  const checkInText = formatDate(checkIn);
  const checkOutText = formatDate(checkOut);

  const roomPrice = room?.price || 0;
  const subtotal = roomPrice * nights;
  const discountAmount = Math.round((discountPercent / 100) * subtotal);
  const serviceFee = 100;
  const total = subtotal - discountAmount + serviceFee;
  const currency = room?.property?.currency ?? "Rs";

  return (
    <>
      <PageMetaData title="Hotel - Details" />

      <TopNavBar4 />

      <main>
        {loading ? (
          <>Loading</>
        ) : !room ? (
          <>No details found</>
        ) : (
          <>
            <AvailabilityFilter />
            <HotelGallery
              hotelDetails={{
                name: room?.property?.listingName,
                address: room?.property?.location,
              }}
              gallery={room?.property?.gallery}
            />

            <section className="pt-0">
              <Container data-sticky-container>
                <Row className="g-4 g-xl-5">
                  <Col xl={7}>
                    <div className="vstack gap-5">
                      <Card className="bg-transparent">
                        <CardHeader className="border-bottom bg-transparent px-0 pt-0">
                          <h3 className="mb-0">About This Hotel </h3>
                        </CardHeader>
                        <CardBody className="pt-4 p-0">
                          <h5 className="fw-light mb-4">Main Highlights</h5>
                          <div className="hstack gap-3 mb-3">
                            <OverlayTrigger
                              overlay={<Tooltip>Free Wifi</Tooltip>}
                            >
                              <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                                <FaWifi size={24} />
                              </div>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={<Tooltip>Swimming Pool</Tooltip>}
                            >
                              <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                                <FaSwimmingPool size={24} />
                              </div>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={<Tooltip>Central AC</Tooltip>}
                            >
                              <div className="icon-lg bg-light h5 rounded-2 flex-centered">
                                <FaSnowflake size={24} />
                              </div>
                            </OverlayTrigger>
                            <OverlayTrigger
                              overlay={<Tooltip>Free Service</Tooltip>}
                            >
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

                      <CustomerReview hotelDetails={hotelDetails} />

                      <HotelPolicies />
                    </div>
                  </Col>

                  <Col as={"aside"} xl={5}>
                    <Card
                      className="bg-transparent border sticky-top"
                      style={{ top: "100px" }}
                    >
                      <CardHeader className="bg-transparent border-bottom">
                        <h4 className="card-title mb-0">Price Summary </h4>
                      </CardHeader>
                      <CardBody>
                        <Row className="g-4 mb-3">
                          <Col md={6}>
                            <div className="bg-light py-3 px-4 rounded-3">
                              <h6 className="fw-light small mb-1">Check-in</h6>
                              <h6 className="mb-0">{checkInText} </h6>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="bg-light py-3 px-4 rounded-3">
                              <h6 className="fw-light small mb-1">Check out</h6>
                              <h6 className="mb-0">{checkOutText} </h6>
                            </div>
                          </Col>
                        </Row>
                        <ul className="list-group list-group-borderless mb-3">
                          <li className="list-group-item px-2 d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              {currency} {room?.price} x {nights} Nights
                            </span>
                            <span className="h6 fw-light mb-0">
                              {currency}
                              {room?.price * nights}
                            </span>
                          </li>
                          <li className="list-group-item px-2 d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              {discountPercent}% campaign discount
                            </span>
                            <span className="h6 fw-light mb-0">
                              {currency} {discountAmount}
                            </span>
                          </li>
                          <li className="list-group-item px-2 d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              Services Fee
                            </span>
                            <span className="h6 fw-light mb-0">
                              {currency} 100
                            </span>
                          </li>
                          <li className="list-group-item bg-light d-flex justify-content-between rounded-2 px-2 mt-2">
                            <span className="h5 fw-normal mb-0 ps-1">
                              Total
                            </span>
                            <span className="h5 fw-normal mb-0">
                              {currency} {total}
                            </span>
                          </li>
                        </ul>
                        <div className="d-grid gap-2">
                          <Button
                            variant="dark"
                            className="mb-0"
                            onClick={() =>
                              navigate(
                                `/hotels/booking?property_id=${room?.property?._id}&room_id=${room?._id}`
                              )
                            }
                          >
                            Continue To Book
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>
          </>
        )}
      </main>

      <FooterWithLinks />
    </>
  );
};

export default RoomExtraDetails;
