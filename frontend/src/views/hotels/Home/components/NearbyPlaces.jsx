import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { nearbyPlacesData } from "../data";
import { useEffect, useState } from "react";
import axios from "axios";
import load from "../../../../assets/images/loading/loading.png";

const NearbyPlaces = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const res = await axios.get(
        "http://localhost:5000/api/v1/customer/nearby",
        {
          params: {
            lat,
            lng,
            page: 1,
            limit: 12,
            maxDistance: 30000,
            sortBy: "distance",
            order: "asc",
          },
        }
      );

      setProperties(res.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <section>
      <Container>
        <Row className="mb-4">
          <Col xs={12} className="text-center">
            <h2 className="mb-0">Explore Nearby</h2>
          </Col>
        </Row>

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <img
              src={load}
              alt="loading"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />

            <style>
              {`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}
            </style>
          </div>
        )}
        <Row className="g-4 g-md-5">
          {(properties ?? []).map((place, idx) => (
            <Col xs={6} sm={4} lg={3} xl={2} key={idx + place.name}>
              <Card className="bg-transparent text-center p-1 h-100">
                <img
                  src={place?.thumbnail}
                  className="rounded-circle new-image-style-round"
                />
                <div className="card-body p-0 pt-3">
                  <h5 className="card-title">
                    <Link to="" className="stretched-link">
                      {place?.listingName}
                    </Link>
                  </h5>
                  <span>{place?.driveTime}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
export default NearbyPlaces;
