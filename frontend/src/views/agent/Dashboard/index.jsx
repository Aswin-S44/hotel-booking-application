import { Col, Container, Row } from "react-bootstrap";
import {
  BsBarChartLineFill,
  BsGraphUpArrow,
  BsHouseDoor,
  BsJournals,
  BsStar,
} from "react-icons/bs";
import BookingChart from "./components/BookingChart";
import BookingTrafficChart from "./components/BookingTrafficChart";
import StatisticsCard from "./components/StatisticsCard";
import UpcomingBookings from "./components/UpcomingBookings";

import { PageMetaData } from "@/components";
import { useEffect, useState } from "react";
const Dashboard = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopID, setshopID] = useState(true);

  const token = localStorage.getItem("token");




  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/shops/stats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setshopID(result?.data?.shopId)


        if (result.success) {
          const { listings, earnings, visitors, reviews } = result.data;

          const formattedStats = [
            {
              title: "Total Listings",
              state: listings.toLocaleString(),
              icon: BsJournals,
              variant: "bg-success",
            },
            {
              title: "Earning",
              state: `${earnings.toLocaleString()}`,
              icon: BsGraphUpArrow,
              variant: "bg-info",
            },
            {
              title: "Visitors",
              state:
                visitors > 999
                  ? (visitors / 1000).toFixed(1) + "K"
                  : visitors.toString(),
              icon: BsBarChartLineFill,
              variant: "bg-warning",
            },
            {
              title: "Total Reviews",
              state:
                reviews > 999
                  ? (reviews / 1000).toFixed(1) + "K"
                  : reviews.toString(),
              icon: BsStar,
              variant: "bg-primary",
            },
          ];

          setStatistics(formattedStats);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageMetaData title="Agent Dashboard" />

      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsHouseDoor className=" fa-fw me-1" />
                Dashboard
              </h1>
            </Col>
          </Row>
          <Row className="g-4">
            {statistics.map((statistic, idx) => (
              <Col key={idx} sm={6} xl={3}>
                {" "}
                <StatisticsCard statistic={statistic} />{" "}
              </Col>
            ))}
          </Row>
          <Row className="g-4">
            <Col lg={7} xl={8}>
              <BookingChart />
            </Col>

            <Col lg={5} xl={4}>
              <BookingTrafficChart shopID={shopID} />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <UpcomingBookings />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
export default Dashboard;
