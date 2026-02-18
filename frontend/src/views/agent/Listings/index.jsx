import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { BsJournals } from "react-icons/bs";
import { roomBookingList, statistics } from "./data";
import StatisticWidget from "./components/StatisticWidget";
import ListingCard from "./components/ListingCard";
import { PageMetaData } from "@/components";
import { useEffect, useState } from "react";
import axios from "axios";
const Listings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [statistics, setStatistics] = useState([]);
const [trigger, setTrigger] = useState(false);


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/v1/shops/rooms",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // 👈 IMPORTANT
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        setLoading(false);

        if (data && data.data) {
          setRooms(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRooms();
  }, [trigger]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/shops/listings/count",
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

          const formattedStats = [
            {
              title: "Earning",
              state: `${earnings.toLocaleString()}`,
              change: "0.00%", // Calculated if you have monthly data
              changeLabel: "vs last month",
              link: "View statement",
              variant: "text-success",
              tag: "After US royalty withholding tax",
            },
            {
              title: "Booked Rooms",
              state: bookedRooms.toString(),
              change: totalListings.toString(),
              changeLabel: "Total Rooms",
              link: "View Bookings",
              variant: "text-info",
            },
            {
              title: "Available Rooms",
              state: availableRooms.toString(),
              change: totalListings.toString(),
              changeLabel: "Total Rooms",
              link: "View Rooms",
              variant: "text-warning",
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

    if (token) fetchStats();
  }, [token]);

console.log("rooms========>>>>>>>>>>>",rooms);


  return (
    <>
      <PageMetaData title="Agent Listings" />

      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsJournals className=" fa-fw me-1" />
                Listings
              </h1>
            </Col>
          </Row>
          <Row className="g-4">
            {statistics.map((statistic, idx) => {
              return (
                <Col md={6} xl={4} key={idx}>
                  <StatisticWidget statistic={statistic} />
                </Col>
              );
            })}
          </Row>
          <Row>
            <Col xs={12}>
              <Card className="border">
                <CardHeader className="border-bottom">
                  <h5 className="card-header-title">
                    My Listings{" "}
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {rooms?.length} Items
                    </span>
                  </h5>
                </CardHeader>
                <CardBody className="vstack gap-3">
                  {loading ? (
                    <>Loadding....</>
                  ) : rooms.length == 0 ? (
                    <>No rooms available</>
                  ) : (
                    rooms.map((room, idx) => (
                      <ListingCard key={idx} roomListCard={room} setRooms={setRooms}/>
                    ))
                  )}
                  {/* {roomBookingList.map((room, idx) => (
                    <ListingCard key={idx} roomListCard={room} />
                  ))} */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
export default Listings;
