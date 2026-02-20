import { FaHotel } from "react-icons/fa";
import BookingCard from "./BookingCard";

const CancelledBooking = ({ bookings }) => {
  return (
    <>
      <h6>Cancelled booking ({bookings?.length ?? 0})</h6>

      {bookings?.length == 0 ? (
        <>No cancelled bookings</>
      ) : (
        bookings.map((booking) => <BookingCard booking={booking} />)
      )}
    </>
  );
};
export default CancelledBooking;
