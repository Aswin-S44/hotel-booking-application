import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { ourStories } from '../data';
const OurStory = () => {
  return <section className="pt-0 pt-lg-5">
      <Container>
        <Row className="mb-4 mb-md-5">
          <Col md={10} className="mx-auto">
            <h3 className="mb-4">Our Story</h3>
            <p className="fw-bold">
              Happifi Stays was founded with a simple vision  to make hotel booking easy, reliable, and comfortable for every traveler visiting Kerala. Inspired by the warmth of South Indian hospitality, we focus on connecting guests with quality hotels that offer cleanliness, safety, and genuine care. We believe every stay should feel peaceful, welcoming, and truly satisfying.
            </p>
            <p className="mb-0">
              Over the years, we have built trusted relationships with carefully selected hotels to ensure a seamless experience from booking to checkout. Our goal is not just to provide rooms, but to create comfortable stays that reflect the calm and cultural richness of Kerala.
            </p>
          </Col>
        </Row>
        {/* <Row className="g-4">
          {ourStories.map((item, idx) => {
          const Icon = item.icon;
          return <Col key={idx} sm={6} lg={3}>
                <div className={clsx('icon-lg bg-opacity-10 rounded-2', item.variant)}>
                  <Icon size={21} />
                </div>
                <h5 className="mt-2">{item.title}</h5>
                <p className="mb-0">{item.description}</p>
              </Col>;
        })}
        </Row> */}
      </Container>
    </section>;
};
export default OurStory;