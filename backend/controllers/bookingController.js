import { BookingService } from "../services/booking.js";

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id; // from Supabase token
        const { room_id, check_in, check_out, total_price } = req.body;

        if(!room_id || !check_in || !check_out || !total_price){
            return res.status(400).json({
                message: "Missing booking fields"
            });
        }

        const booking = await BookingService.createBooking({
            user_id: userId,
            room_id,
            check_in,
            check_out,
            total_price
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await BookingService.getUserBookings(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        await BookingService.cancelBooking(bookingId, req.user.id);

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};