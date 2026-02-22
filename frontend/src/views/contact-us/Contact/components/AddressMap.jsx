import { Col, Container, Row } from 'react-bootstrap';
const AddressMap = () => {
  return <section className="pt-0 pt-lg-5">
      <Container>
        <Row>
          <Col xs={12}>
            <iframe title="map" className="w-100 h-300px grayscale rounded" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7891.643101328525!2d76.9018013!3d8.5167003!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bde934249889%3A0x29336af4838fce88!2sHappifi%20Stays!5e0!3m2!1sen!2sin!4v1771704062158!5m2!1sen!2sin" height={500} style={{
            border: 0
          }} aria-hidden="false" tabIndex={0} />
          </Col>
        </Row>


      </Container>
    </section>;
};
export default AddressMap;