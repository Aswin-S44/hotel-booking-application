import { Card, CardBody, CardHeader } from 'react-bootstrap';
const Payment = () => {
  return <Card className="bg-transparent border p-0">
    <CardHeader className="bg-transparent border-bottom p-4">
      <h5 className="mb-0">Payment</h5>
    </CardHeader>
    <CardBody className="p-4 pt-0">
      <div className="mt-4">
        <h6 className="fw-normal">What payment methods do you accept?</h6>
        <p className="mb-0">
          Happifi Stays currently accepts major Credit and Debit cards along with secure online payment gateways. All transactions are encrypted to ensure safe and reliable payment processing. Please ensure that billing details are entered correctly during checkout to avoid delays. Payment confirmation will be sent immediately after successful processing.
        </p>
      </div>
      <div className="mt-4">
        <h6 className="fw-normal">How do I get my refund?</h6>
        <p className="mb-0">
          Eligible refunds will be processed based on the hotel’s cancellation policy and payment method used. Once approved, refunds are initiated within the standard processing timeframe of the respective bank or payment provider. You will receive confirmation once the refund is successfully initiated. For any concerns, our support team is always available to assist you.
        </p>
      </div>
    </CardBody>
  </Card>;
};
export default Payment;