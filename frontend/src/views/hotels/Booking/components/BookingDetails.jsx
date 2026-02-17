import { Col, Container, Row, Button } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import GuestDetails from "./GuestDetails";
import HotelInformation from "./HotelInformation";
import LoginAdvantages from "./LoginAdvantages";
import OfferAndDiscounts from "./OfferAndDiscounts";
import PaymentOptions from "./PaymentOptions";
import PriceSummary from "./PriceSummary";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get("property_id");
  const roomId = searchParams.get("room_id");

  const methods = useForm({
    defaultValues: {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: [],
      selectedPaymentTypeId: 1,
      cardNumber: "",
      expirationDate: "",
      expirationYear: "",
      cvv: "",
      cardName: "visa",
      checkInDate: "2026-12-12",
      checkOutDate: "2026-12-14",
      totalAmount: 1000,
      paymentStatus: "paid",
      status: "booked",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/customer/booking/${propertyId}/${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Booking successful!");
        navigate("/bookings");
      } else {
        alert(result.message || "Booking failed");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container>
            <Row className="g-4 g-lg-5">
              <Col xl={8}>
                <div className="vstack gap-5">
                  <HotelInformation />
                  <GuestDetails control={methods.control} />
                  <PaymentOptions
                    control={methods.control}
                    handleSubmit={methods.handleSubmit}
                  />

                  <div className="d-grid mt-4">
                    <Button variant="primary" size="lg" type="submit">
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </Col>
              <Col as="aside" xl={4}>
                <Row className="g-4">
                  <Col md={6} xl={12}>
                    <PriceSummary />
                  </Col>
                  <Col md={6} xl={12}>
                    <OfferAndDiscounts />
                  </Col>
                  <Col md={6} xl={12}>
                    <LoginAdvantages />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </form>
      </FormProvider>
    </section>
  );
};

export default BookingDetails;
