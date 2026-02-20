import { currency } from "@/states";
import { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
} from "react-bootstrap";
const PriceSummary = ({ total, discount }) => {
  console.log("TOTAL : ", total);
  console.log("DISCOUNT ; ", discount);
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomId = params.get("room_id");

    if (roomId) {
      const fetchHotelRooms = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/customer/rooms/${roomId}`
          );
          const result = await response.json();
          console.log("result----------------", result);
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

  const price = data?.room?.price || 0;
  const discountPercent = data?.room?.discount || 0;

  const discountAmount = (price * discountPercent) / 100;
  const finalPrice = price - discountAmount;

  return (
    <Card className="shadow rounded-2">
      <CardHeader className="border-bottom">
        <CardTitle as="h5" className="mb-0">
          Price Summary
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ul className="list-group list-group-borderless">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">Room Charges</span>
            <span className="fs-5">
              {currency} {total}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">
              Total Discount
              <span className="badge text-bg-danger smaller mb-0 ms-2">
                {discount}% off
              </span>
            </span>
            <span className="fs-5 text-success">
              -{currency}
              {discount}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">Price after discount</span>
            <span className="fs-5">
              {currency}
              {total - discount}
            </span>
          </li>
          {/* <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">Taxes % Fees</span>
            <span className="fs-5">{currency}100</span>
          </li> */}
        </ul>
      </CardBody>
      <CardFooter className="border-top">
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">Payable Now</span>
          {/* <span className="h5 mb-0">
            {currency}
            {finalPrice + 100}
          </span> */}
          <span className="h5 mb-0">
            {currency}
            {total - discount}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
export default PriceSummary;
