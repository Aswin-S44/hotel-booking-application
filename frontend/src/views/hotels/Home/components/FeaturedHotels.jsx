import { currency } from "@/states";
import { Card, Col, Container, Row } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../../config/env";

const FeaturedHotels = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/customer/properties`
        );
        const result = await response.json();
        if (result.success) {
          setFeaturedHotels(result.data);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) return null;

  return (
    <section>
      <Container>
        <Row className="mb-4 align-items-center">
          <Col
            xs={12}
            className="d-flex justify-content-between align-items-end"
          >
            <h2 className="mb-0">Featured Hotels</h2>
            <Link
              to="/hotels/grid"
              className="btn btn-link p-0 text-primary text-decoration-none"
            >
              View all
            </Link>
          </Col>
        </Row>
        <Row className="g-4">
          {featuredHotels.slice(0, 4).map((hotel, idx) => (
            <Col key={hotel._id || idx} sm={6} xl={3}>
              <Card className="card-img-scale overflow-hidden bg-transparent">
                <div className="card-img-scale-wrapper rounded-3">
                  <img
                    src={hotel.thumbnail}
                    className="card-img"
                    alt={hotel.listingName}
                  />
                  <div className="position-absolute bottom-0 start-0 p-3">
                    <div className="badge text-bg-dark fs-6 rounded-pill stretched-link d-flex">
                      <BsGeoAlt className=" me-2" />
                      {hotel.location?.city}, {hotel.location?.country}
                    </div>
                  </div>
                </div>
                <div className="card-body px-2">
                  <h5 className="card-title">
                    <Link
                      to={`/hotels/detail/${hotel?._id}`}
                      className="stretched-link"
                    >
                      {hotel.listingName}
                    </Link>
                  </h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-success mb-0">
                      {currency}
                      {hotel.basePrice}{" "}
                      <small className="fw-light">/starting at</small>
                    </h6>
                    <h6 className="mb-0 d-flex align-items-center">
                      {hotel?.averageRating}
                      <FaStar size={18} className="text-warning ms-1" />
                    </h6>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedHotels;
