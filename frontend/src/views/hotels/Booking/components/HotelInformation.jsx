import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Image,
  Row,
} from "react-bootstrap";
import { FaHotel, FaStar } from "react-icons/fa6";
import hotel2 from "@/assets/images/category/hotel/4by3/02.jpg";
import { Link } from "react-router-dom";
import {
  BsAlarm,
  BsBrightnessHigh,
  BsGeoAlt,
  BsPatchCheckFill,
} from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const HotelInformation = () => {


  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [data, setData] = useState([]);
const stored = localStorage.getItem('searchData');
const parsedData = stored ? JSON.parse(stored) : null;

console.log("parsedData",parsedData);



const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

const checkIn = formatDate(parsedData?.stayFor[0]);
const checkOut = formatDate(parsedData?.stayFor[1]);


  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const propertyId = params.get("property_id");
    const roomId = params.get("room_id");

    if (propertyId && roomId) {
      fetchReviews(propertyId, roomId);
    }
  }, [location.search]);

  const fetchReviews = async (propertyId, roomId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/customer/property/${propertyId}/review/${roomId}`
      );

      setReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };


  const calculateAverage = (reviews) => {
    if (!reviews || reviews.length === 0) return "0.0/5.0";

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return `${average.toFixed(1)}/5.0`;
  };








  useEffect(() => {
    console.log("trigger");

    const params = new URLSearchParams(location.search);
    const propertyId = params.get("property_id");

    if (propertyId) {
      const fetchHotelRooms = async () => {
        try {

          const response = await fetch(
            `http://localhost:5000/api/v1/customer/property/${propertyId}`
          );
          const result = await response.json();

          if (result && result.data) {
            setData(result.data);
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {

        }
      };
      fetchHotelRooms();
    }
  }, []);







  const averageRating = calculateAverage(reviews);

  return <Card className="shadow">
    <CardHeader className="p-4 border-bottom">
      <h3 className="mb-0 items-center">
        <FaHotel className="me-2" />
        Hotel Information
      </h3>
    </CardHeader>
    <CardBody className="p-4">
      <Card className="mb-4">
        <Row className="align-items-center">
          <Col sm={6} md={3}>
            <Image src={data?.thumbnail} className="card-img" />
          </Col>
          <Col sm={6} md={9}>
            <CardBody className="pt-3 pt-sm-0 p-0">
              <h5 className="card-title">
                <Link to="">{data?.listingName}</Link>
              </h5>
              <p className="small mb-2 items-center">
                <BsGeoAlt className=" me-2" />
                {data?.location?.street}, {data?.location?.city}, {data?.location?.state}, {data?.location?.country} {data?.location?.postalCode}
              </p>
              <ul className="list-inline mb-0 items-center">
                {Array.from(new Array(4)).map((_val, idx) => <li key={idx} className="list-inline-item me-1 mb-1 small">
                  <FaStar size={16} className="text-warning" />
                </li>)}
                <li className="list-inline-item me-0 mb-1 small">
                  <FaStarHalfAlt size={16} className="text-warning" />
                </li>
                <li className="list-inline-item ms-3 h6 small fw-bold mb-0">{data?.starRating} /5.0</li>
              </ul>
            </CardBody>
          </Col>
        </Row>
      </Card>
      <Row className="g-4">
        <Col lg={4}>
          <div className="bg-light py-3 px-4 rounded-3">
            <h6 className="fw-light small mb-1">Check-in</h6>
            <h5 className="mb-1">{checkIn}</h5>
            <small className="items-center">
              <BsAlarm className=" me-1" />
              12:00 pm
            </small>
          </div>
        </Col>
        <Col lg={4}>
          <div className="bg-light py-3 px-4 rounded-3">
            <h6 className="fw-light small mb-1">Check out</h6>
            <h5 className="mb-1">{checkOut}</h5>
            <small className="items-center">
              <BsAlarm className=" me-1" />
              11:00 am
            </small>
          </div>
        </Col>
        <Col lg={4}>
          <div className="bg-light py-3 px-4 rounded-3">
            <h6 className="fw-light small mb-1">Rooms &amp; Guests</h6>
            <h5 className="mb-1">{parsedData?.guests.adults} G - {parsedData?.guests.rooms} R  {parsedData?.guests.children > 0 ? parsedData?.guests.children + ' C' : ''}</h5>
            <small className="items-center">
              <BsBrightnessHigh className=" me-1" />3 Nights - 4 Days
            </small>
          </div>
        </Col>
      </Row>
      <Card className="border mt-4">
        <CardHeader className="border-bottom d-md-flex justify-content-md-between">
          <h5 className="card-title mb-0">Deluxe Pool View with Breakfast</h5>
          <Button variant="link" className="p-0 mb-0">
            View Cancellation Policy
          </Button>
        </CardHeader>
        <CardBody className="card-body">
          <h6>Price Included</h6>
          <ul className="list-group list-group-borderless mb-0">
            <li className="list-group-item h6 fw-light d-flex mb-0 items-center ">
              <BsPatchCheckFill className=" text-success me-2" />
              Free Breakfast and Lunch/Dinner.
            </li>
            <li className="list-group-item h6 fw-light d-flex mb-0 items-center ">
              <BsPatchCheckFill className=" text-success me-2" />
              Great Small Breaks.
            </li>
            <li className="list-group-item h6 fw-light d-flex mb-0 items-center ">
              <BsPatchCheckFill className=" text-success me-2" />
              Free Stay for Kids Below the age of 12 years.
            </li>
            <li className="list-group-item h6 fw-light d-flex mb-0 items-center ">
              <BsPatchCheckFill className=" text-success me-2" />
              On Cancellation, You will not get any refund
            </li>
          </ul>
        </CardBody>
      </Card>
    </CardBody>
  </Card>;
};
export default HotelInformation;
