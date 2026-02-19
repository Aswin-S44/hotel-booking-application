import { PageMetaData } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TopNavBar4 from "../tours/Grid/components/TopNavBar4";
import AvailabilityFilter from "./Grid/components/AvailabilityFilter";
import HotelGallery from "./HotelDetails/components/HotelGallery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FaCalendarAlt,
} from "react-icons/fa";
import CustomerReview from "./HotelDetails/components/CustomerReview";
import HotelPolicies from "./HotelDetails/components/HotelPolicies";
import FooterWithLinks from "../../layouts/HelpLayout/FooterWithLinks";

const RoomExtraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  useEffect(() => {
    const savedFilter = localStorage.getItem("searchData");
    if (savedFilter) {
      const formValue = JSON.parse(savedFilter);
      if (formValue?.stayFor?.[0]) setCheckIn(new Date(formValue.stayFor[0]));
      if (formValue?.stayFor?.[1]) setCheckOut(new Date(formValue.stayFor[1]));
    }
  }, []);

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

  const nights =
    Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
  const roomPrice = room?.price || 0;
  const serviceFee = room?.property?.policy?.extraCharges || 0;
  const subtotal = roomPrice * nights;
  const total = subtotal + serviceFee;
  const currency = room?.property?.currency ?? "Rs";

  const handleBookNow = () => {
    const bookingData = {
      propertyId: room?.property?._id,
      roomId: room?._id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      nights,
      roomPrice,
      serviceFee,
      total,
      currency,
      hotelName: room?.property?.listingName,
    };
    navigate(
      `/hotels/booking?property_id=${room?.property?._id}&room_id=${room?._id}`,
      { state: bookingData }
    );
  };

  return (
    <>
      <PageMetaData title="Hotel - Details" />
      <TopNavBar4 />
      <main>
        {!room ? (
          <Container className="py-5 text-center">No details found</Container>
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
              <Container>
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
                          <div
                            dangerouslySetInnerHTML={{
                              __html: room?.property?.description,
                            }}
                          />
                        </CardBody>
                      </Card>
                      <Card className="bg-transparent">
                        <CardHeader className="border-bottom bg-transparent px-0 pt-0">
                          <h3 className="card-title mb-0">Amenities</h3>
                        </CardHeader>
                        <CardBody className="pt-4 p-0">
                          <Row className="g-4">
                            {hotelDetails?.amenities?.map((amenity, idx) => (
                              <Col sm={6} key={idx}>
                                <ul className="list-group list-group-borderless mt-2 mb-0">
                                  <li className="list-group-item pb-0 d-flex align-items-center">
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
                            <div className="form-control-bg-light">
                              <label className="form-label small h6 fw-light">
                                Check-in
                              </label>
                              <div className="position-relative">
                                <DatePicker
                                  selected={checkIn}
                                  onChange={(date) => {
                                    setCheckIn(date);
                                    if (date >= checkOut) {
                                      const nextDay = new Date(date);
                                      nextDay.setDate(nextDay.getDate() + 1);
                                      setCheckOut(nextDay);
                                    }
                                  }}
                                  minDate={new Date()}
                                  className="form-control flatpickr"
                                  placeholderText="Select date"
                                />
                                <FaCalendarAlt className="position-absolute top-50 end-0 translate-middle-y me-3" />
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-control-bg-light">
                              <label className="form-label small h6 fw-light">
                                Check-out
                              </label>
                              <div className="position-relative">
                                <DatePicker
                                  selected={checkOut}
                                  onChange={(date) => setCheckOut(date)}
                                  minDate={
                                    new Date(
                                      new Date(checkIn).setDate(
                                        checkIn.getDate() + 1
                                      )
                                    )
                                  }
                                  className="form-control flatpickr"
                                  placeholderText="Select date"
                                />
                                <FaCalendarAlt className="position-absolute top-50 end-0 translate-middle-y me-3" />
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <ul className="list-group list-group-borderless mb-3">
                          <li className="list-group-item px-2 d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              {currency} {roomPrice} x {nights}{" "}
                              {nights > 1 ? "Nights" : "Night"}
                            </span>
                            <span className="h6 fw-light mb-0">
                              {currency} {subtotal}
                            </span>
                          </li>
                          <li className="list-group-item px-2 d-flex justify-content-between">
                            <span className="h6 fw-light mb-0">
                              Service Fee
                            </span>
                            <span className="h6 fw-light mb-0">
                              {currency} {serviceFee}
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
                            onClick={handleBookNow}
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
