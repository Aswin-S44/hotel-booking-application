import { Col, Container, Row } from "react-bootstrap";
import { hotels } from "../data";
import HotelGridCard from "./HotelGridCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const HotelGridLayout = () => {
  const location = useLocation();
  const [hotelsData, setHotels] = useState([]);
  const [apiHotels, setApiHotels] = useState([]); // ✅ new variable
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.hotels) {
      // setHotels(location.state.hotels);
    }
  }, [location.state]);

  const [searchParams] = useSearchParams();
  const searchLocation = searchParams.get("location");

  const [searchHotelsData, setSearchHotelsData] = useState([]);

  useEffect(() => {
    const fetchSearchHotelsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/customer/search-location",
          {
            params: { location: searchLocation },
          }
        );

        setSearchHotelsData(response.data.data);
      } catch (error) {
        console.log("Search Hotels API Error:", error);
      }
    };

    if (searchLocation) {
      fetchSearchHotelsData();
    }
  }, [searchLocation]);

  const fetchHotels = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/v1/customer/properties",
        {
          params: { page, limit: 6 },
        }
      );

      setApiHotels(response.data.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page]);

  const displayHotels = searchLocation ? searchHotelsData : apiHotels || [];

  return (
    <section className="pt-0">
      <Container>
        <Row className="g-4">
          {displayHotels?.map((hotel, idx) => {
            return (
              <Col key={idx} md={6} xl={4}>
                <HotelGridCard
                  id={hotel._id}
                  name={hotel.listingName}
                  price={hotel.basePrice}
                  feature={hotel.amenities}
                  images={hotel.gallery}
                  rating={hotel.averageRating}
                  sale={hotel.discount}
                />
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col xs={12}>
            <nav
              className="mt-4 d-flex justify-content-center"
              aria-label="navigation"
            >
              <ul className="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                <li className="page-item mb-0">
                  <Link className="page-link" to="" tabIndex={-1}>
                    <FaAngleLeft />
                  </Link>
                </li>
                <li className="page-item mb-0">
                  <Link className="page-link" to="">
                    1
                  </Link>
                </li>
                <li className="page-item mb-0 active">
                  <Link className="page-link" to="">
                    2
                  </Link>
                </li>
                <li className="page-item mb-0">
                  <Link className="page-link" to="">
                    ..
                  </Link>
                </li>
                <li className="page-item mb-0">
                  <Link className="page-link" to="">
                    6
                  </Link>
                </li>
                <li className="page-item mb-0">
                  <Link className="page-link" to="">
                    <FaAngleRight />
                  </Link>
                </li>
              </ul>
            </nav>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default HotelGridLayout;
