import { Card, CardBody, CardHeader } from 'react-bootstrap';
const Booking = () => {
  return <Card className="border bg-transparent p-0">
      <CardHeader className="bg-transparent border-bottom p-4">
        <h5 className="mb-0">Booking</h5>
      </CardHeader>
      <CardBody className="p-4 pt-0">
        <div className="mt-4">
          <h6 className="fw-normal">Can I move my booking to a future date?</h6>
          <p className="mb-0">
            Yes, date changes are possible based on hotel availability and the property’s rescheduling policy. We recommend informing us at least 48 hours before your check-in date for smooth processing. Any fare difference due to seasonal pricing or room category changes will be communicated clearly before confirmation. Our support team will assist you in finding the best available alternative dates.
          </p>
        </div>
        <div className="mt-4">
          <h6 className="fw-normal">Can I give my reservation to someone else?</h6>
          <p className="mb-0">
           Name changes may be allowed depending on the hotel's policy. You must notify our team prior to check-in with valid identification details of the new guest. Some properties may require written confirmation or additional verification for security reasons. We advise contacting our support team early to ensure a hassle-free transfer process.
          </p>
        </div>
        <div className="mt-4">
          <h6 className="fw-normal">How can I get help with an existing reservation?</h6>
          <p className="mb-0">
            For any assistance regarding your booking, you can contact our customer support team via phone or email. Please keep your booking reference number ready for faster service. Our team will guide you regarding modifications, special requests, or property-related clarifications. We are committed to ensuring your stay remains smooth and comfortable.
          </p>
        </div>
        <div className="mt-4">
          <h6 className="fw-normal">You can change your booking at any time</h6>
          <p className="mb-0">
            Changes can be requested before the hotel’s cancellation deadline mentioned at the time of booking. Modifications are subject to room availability and hotel terms. Any price differences or applicable charges will be informed transparently. We aim to make every adjustment simple and stress-free for our guests.
          </p>
        </div>
      </CardBody>
    </Card>;
};
export default Booking;