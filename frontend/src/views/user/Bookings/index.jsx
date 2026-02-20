import {
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContainer,
  TabContent,
  TabPane,
  Spinner,
} from "react-bootstrap";
import { BsBriefcaseFill, BsPatchCheck, BsXOctagon } from "react-icons/bs";
import UpcomingBooking from "./components/UpcomingBooking";
import CancelledBooking from "./components/CancelledBooking";
import CompletedBooking from "./components/CompletedBooking";
import { PageMetaData } from "@/components";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("booked");

  const fetchBookings = useCallback(
    async (signal) => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/customer/bookings/category?type=${activeTab}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: signal,
          }
        );
        if (data.success) {
          setBookings(data.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        setBookings([]);
      } finally {
        setLoading(false);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);
    return () => controller.abort();
  }, [fetchBookings]);

  return (
    <>
      <PageMetaData title="User Bookings" />
      <Card className="border bg-transparent">
        <CardHeader className="bg-transparent border-bottom">
          <h4 className="card-header-title">My Bookings</h4>
        </CardHeader>

        <CardBody className="p-0">
          <TabContainer
            activeKey={activeTab}
            onSelect={(k) => {
              setBookings([]);
              setActiveTab(k);
            }}
          >
            <Nav className="nav nav-tabs nav-bottom-line nav-responsive nav-justified">
              <NavItem>
                <NavLink eventKey="booked" className="mb-0 flex-centered">
                  <BsBriefcaseFill className="fa-fw me-1" /> Upcoming
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey="cancelled" className="mb-0 flex-centered">
                  <BsXOctagon className="fa-fw me-1" /> Cancelled
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey="checked_out" className="mb-0 flex-centered">
                  <BsPatchCheck className="fa-fw me-1" /> Completed
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent className="p-2 p-sm-4">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <TabPane eventKey="booked">
                    <UpcomingBooking
                      bookings={bookings}
                      onRefresh={fetchBookings}
                    />
                  </TabPane>
                  <TabPane eventKey="cancelled">
                    <CancelledBooking bookings={bookings} />
                  </TabPane>
                  <TabPane eventKey="checked_out">
                    <CompletedBooking bookings={bookings} />
                  </TabPane>
                </>
              )}
            </TabContent>
          </TabContainer>
        </CardBody>
      </Card>
    </>
  );
};

export default Bookings;
