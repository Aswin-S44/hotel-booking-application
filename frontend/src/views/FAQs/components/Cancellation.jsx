import { Card, CardBody, CardHeader } from 'react-bootstrap';
const Cancellation = () => {
  return <Card className="bg-transparent border p-0">
      <CardHeader className="bg-transparent border-bottom p-4">
        <h5 className="mb-0">Cancellation</h5>
      </CardHeader>
      <CardBody className="p-4 pt-0">
        <div className="mt-4">
          <h6 className="fw-normal">How can I cancel my hotel booking?</h6>
          <p className="mb-0">
            You can cancel your reservation through your booking confirmation email or by contacting our support team. Cancellation policies vary depending on the hotel and selected rate plan. Refund eligibility will be determined according to the property’s cancellation window. We recommend reviewing the cancellation terms before confirming your booking.
          </p>
        </div>
        <div className="mt-4">
          <h6 className="fw-normal">How do I cancel my booking in special situations?</h6>
          <p className="mb-0">
           In case of emergencies or unavoidable circumstances, please reach out to our support team immediately. We will coordinate with the hotel to explore flexible solutions whenever possible. While cancellation policies are set by individual hotels, we always try our best to assist you fairly. Supporting our guests during unexpected situations is our priority.
          </p>
        </div>
        <div className="mt-4">
          <h6 className="fw-normal">How can I cancel or postpone a reservation made through Happifi Stays?</h6>
          <p className="mb-0">
            If you booked directly through Happifi Stays, you can manage your reservation using your confirmation details. Postponements are subject to availability and applicable rate differences. Refunds, if eligible, will be processed according to the hotel’s policy. Our team is available to guide you step by step throughout the process.
          </p>
        </div>
      </CardBody>
    </Card>;
};
export default Cancellation;