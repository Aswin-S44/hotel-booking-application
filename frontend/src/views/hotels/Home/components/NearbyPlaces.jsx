import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import load from "../../../../assets/images/loading/loading.png";

const NearbyPlaces = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchHotels = async (lat, lng) => {
      try {
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
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fetchHotels(lat, lng);
      },
      () => {
        const defaultLat = 9.9865001;
        const defaultLng = 76.1373067;
        fetchHotels(defaultLat, defaultLng);
      }
    );
  }, []);

  return (
    <section>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <Container>
        <Row className="mb-4">
          <Col xs={12} className="text-center">
            <h2 className="mb-0">Explore Nearby</h2>
          </Col>
        </Row>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
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
          </div>
        ) : (
          <Row className="g-4 g-md-5">
            {(properties ?? []).map((place, idx) => (
              <Col
                xs={6}
                sm={4}
                lg={3}
                xl={2}
                key={idx + (place._id || place.listingName)}
              >
                <Card className="bg-transparent text-center p-1 h-100 border-0">
                  <img
                    src={place?.thumbnail}
                    className="rounded-circle new-image-style-round img-fluid"
                    alt={place?.listingName}
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  />
                  <div className="card-body p-0 pt-3">
                    <h5 className="card-title">
                      <Link
                        to={`/hotels/${place._id}`}
                        className="stretched-link text-decoration-none"
                      >
                        {place?.listingName}
                      </Link>
                    </h5>
                    <span className="text-muted small">
                      {place?.distance
                        ? `${(place.distance / 1000).toFixed(1)} km away`
                        : place?.driveTime}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default NearbyPlaces;
