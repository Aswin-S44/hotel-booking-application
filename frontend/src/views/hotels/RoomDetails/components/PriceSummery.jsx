import { currency, currentYear } from "@/states";
import { Button, Card, CardBody, CardHeader, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
const PriceSummery = ({rooms}) => {
  const { id: propertyId } = useParams();

console.log("rooms,rooms,rooms", rooms[0]?.property
);


  const navigate = useNavigate();
const discountPercent = rooms[0].discount || 0;
  const savedFilter = localStorage.getItem('searchData');
  const formValue = savedFilter ? JSON.parse(savedFilter) : null;
  const checkIn = formValue?.stayFor?.[0] ? new Date(formValue.stayFor[0]) : null;
  const checkOut = formValue?.stayFor?.[1] ? new Date(formValue.stayFor[1]) : null;
  const nights =
    checkIn && checkOut
      ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 1;
  const guests = formValue?.guests || { adults: 1, children: 0, rooms: 1 };
  const formatDate = (date) =>
    date
      ? `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`
      : "-";

  const checkInText = formatDate(checkIn);
  const checkOutText = formatDate(checkOut);

// Room price from rooms array (pass rooms as prop or get from state)
const roomPrice = rooms?.[0]?.price || 0;

const subtotal = roomPrice * nights;
const discountAmount = Math.round((discountPercent / 100) * subtotal);
const serviceFee = 100; // keep it dynamic if needed
const total = subtotal - discountAmount + serviceFee;


  console.log("property +++++______++++=======", formValue);

  return (
    <Col as={"aside"} xl={5} className="d-none d-xl-block">
      <Card className="bg-transparent border">
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
                {currency}{rooms[0]?.price} x {nights} Nights
              </span>
              <span className="h6 fw-light mb-0">{currency}{rooms[0]?.price * nights}</span>
            </li>
            <li className="list-group-item px-2 d-flex justify-content-between">
              <span className="h6 fw-light mb-0">{discountPercent}% campaign discount</span>
              <span className="h6 fw-light mb-0">{currency} {discountAmount}</span>
            </li>
            <li className="list-group-item px-2 d-flex justify-content-between">
              <span className="h6 fw-light mb-0">Services Fee</span>
              <span className="h6 fw-light mb-0">{currency}100</span>
            </li>
            <li className="list-group-item bg-light d-flex justify-content-between rounded-2 px-2 mt-2">
              <span className="h5 fw-normal mb-0 ps-1">Total</span>
              <span className="h5 fw-normal mb-0">{currency}{total}</span>
            </li>
          </ul>
          <div className="d-grid gap-2">
            <Button
              variant="dark"
              className="mb-0"
              onClick={() =>
                navigate(
                  `/hotels/booking?property_id=${rooms[0]?.property}&room_id=${rooms[0]?._id}`
                )
              }
            >
              Continue To Book
            </Button>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default PriceSummery;
