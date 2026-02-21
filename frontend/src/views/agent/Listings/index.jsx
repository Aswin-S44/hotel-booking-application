import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { BsJournals, BsSearch } from "react-icons/bs";
import StatisticWidget from "./components/StatisticWidget";
import ListingCard from "./components/ListingCard";
import { PageMetaData } from "@/components";
import { useEffect, useState, useCallback } from "react";
import NotFound from "../../../components/NotFound/NotFound";
import { API_BASE_URL } from "../../../config/env";

const Listings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 5,
        search: debouncedSearch,
        type,
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/shops/rooms?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        const flattenedRooms = data.data.flatMap((property) =>
          property.rooms.map((room) => ({
            ...room,
            listingName: property.listingName,
            listingType: property.listingType,
            location: property.location,
            amenities: property.amenities,
            currency: property.currency,
          }))
        );
        setRooms(flattenedRooms);
        setPagination(data.pagination);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [page, type, debouncedSearch, token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/shops/listings/count`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          const { availableRooms, earnings, bookedRooms, totalListings } =
            result.data;
          setStatistics([
            {
              title: "Earning",
              state: `${earnings.toLocaleString()}`,
              change: "0.00%",
              changeLabel: "vs last month",
              variant: "text-success",
              href: "/agent/earnings",
            },
            {
              title: "Booked Rooms",
              state: bookedRooms.toString(),
              change: totalListings.toString(),
              changeLabel: "Total Rooms",
              variant: "text-info",
              href: "/agent/bookings",
            },
            {
              title: "Available Rooms",
              state: availableRooms.toString(),
              change: totalListings.toString(),
              changeLabel: "Total Rooms",
              variant: "text-warning",
              href: "/agent/rooms",
            },
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <>
      <PageMetaData title="Agent Listings" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0">
                <BsJournals className="me-1" />
                Listings
              </h1>
            </Col>
          </Row>

          <Row className="g-4">
            {statistics.map((statistic, idx) => (
              <Col md={6} xl={4} key={idx}>
                <StatisticWidget statistic={statistic} />
              </Col>
            ))}
          </Row>

          <Card className="border">
            <CardHeader className="border-bottom">
              <Row className="g-3 align-items-center justify-content-between">
                <Col md={4}>
                  <h5 className="mb-0">
                    My Listings{" "}
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {rooms.length} Rooms
                    </span>
                  </h5>
                </Col>
                <Col md={8}>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0">
                          <BsSearch />
                        </span>
                        <Form.Control
                          type="search"
                          placeholder="Search listing..."
                          className="border-start-0"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <Form.Select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Types</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Villa">Villa</option>
                        <option value="Home Stay">Home Stay</option>
                        <option value="Farmhouse">Farmhouse</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardHeader>

            <CardBody
              className="vstack gap-3"
              style={{ minHeight: "400px", position: "relative" }}
            >
              {loading && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    zIndex: 2,
                  }}
                >
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              {!loading && rooms.length === 0 ? (
                <div className="text-center p-4">
                  <NotFound
                    title={"No listings found!"}
                    description={
                      "No rooms available at the moment. Please add your room"
                    }
                  />
                </div>
              ) : (
                <>
                  {rooms.map((room, idx) => (
                    <ListingCard
                      key={room._id || idx}
                      roomListCard={room}
                      setRooms={setRooms}
                    />
                  ))}

                  {pagination.pages > 1 && (
                    <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4">
                      <p className="mb-sm-0 text-center text-sm-start text-muted">
                        Showing Page {page} of {pagination.pages}
                      </p>
                      <Pagination className="pagination-primary-soft mb-0 justify-content-center">
                        <Pagination.Prev
                          disabled={page === 1}
                          onClick={() => setPage((prev) => prev - 1)}
                        />
                        {[...Array(pagination.pages)].map((_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === page}
                            onClick={() => setPage(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          disabled={page === pagination.pages}
                          onClick={() => setPage((prev) => prev + 1)}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Listings;
