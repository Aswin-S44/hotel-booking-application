import BookingCard from "./BookingCard";

const UpcomingBooking = ({ bookings, onRefresh }) => {
  return (
    <>
      <h6>Upcoming bookings ({bookings.length})</h6>

      {bookings.length === 0 ? (
        <div className="p-4 text-center border rounded">
          <p className="mb-0">No upcoming bookings found!</p>
        </div>
      ) : (
        bookings.map((booking, idx) => {
          return (
            <BookingCard
              key={booking._id || idx}
              booking={booking}
              showActions={true}
              onSuccess={onRefresh}
            />
          );
        })
      )}
    </>
  );
};

export default UpcomingBooking;
