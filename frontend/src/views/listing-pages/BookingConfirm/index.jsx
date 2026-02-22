import { PageMetaData } from "@/components";
import ConfirmTicket from "./components/ConfirmTicket";
import FooterWithLinks from "./components/FooterWithLinks";
import TopNavBar4 from "./components/TopNavBar4";
import { useLocation } from "react-router-dom";
const BookingConfirm = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  console.log("BOOKING DATA-------------", bookingData);
  return (
    <>
      <PageMetaData title="Booking Confirmed" />

      <TopNavBar4 />

      <main>
        <ConfirmTicket bookingData={bookingData} />
      </main>

      <FooterWithLinks />
    </>
  );
};
export default BookingConfirm;
