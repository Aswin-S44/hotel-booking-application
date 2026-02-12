import { supabase } from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import { sendBookingEmail } from "./emailService.js";

const confirmationCode = `HF-${uuidv4().slice(0, 8).toUpperCase()}`;

export const BookingService = {
    async createBooking({ user_id, room_id, check_in, check_out, discount, total_price}) {
        //check if room already booked for selected dates
        const { data: existingBookings, error: checkError } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", room_id)
        .or(
            `check_in.lte.${check_out},check_out.gte.${check_in}`
        )
        .neq("status","cancelled");

        if (checkError) throw checkError;

        if(existingBookings.length > 0){
            throw new Error("Room already booked for selected dates");
        }

        //Create booking
        const { data: booking, error: insertError } = await supabase
        .from("bookings")
        .insert([
            {
                user_id,
                room_id,
                check_in,
                check_out,
                discount,
                total_price,
                status: "confirmed"
            }
        ])
        .select()
        .single();

        if (insertError) throw insertError;

        // Save confirmation code
        const { error: emailConfirmation } = await supabase
            .from("bookings")
            .update({ confirmation_code: confirmationCode })
            .eq("id", booking.id);

            if(emailConfirmation) throw emailConfirmation;

            // Send email
            await sendBookingEmail({
                to: userEmail,
                hotelName,
                checkIn: check_in,
                checkOut: check_out,
                price: total_price,
                confirmationCode
            });

        //Update room availability
        const { error: roomUpdateError } = await supabase
        .from("rooms")
        .update({ is_available: false })
        .eq("id", room_id);

        if (roomUpdateError) throw roomUpdateError;

        return booking;
    },

    async getUserBookings(user_id) {
        const { data, error } = await supabase
        .from("bookings")
        .select(`
            id,
            check_in,
            check_out,
            total_price,
            status,
            rooms (
            id,
            name,
            price_per_night,
            image_url
            )
         `)
         .eq("user_id", user_id)
         .order("check_in", {ascending: false});

         if (error) throw error;

         return data;
    },

    async cancelBooking(booking_id, user_id) {
        //Verify ownership
        const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("id, room_id, status")
        .eq("id", booking_id)
        .eq("user_id", user_id)
        .single();

        if (fetchError || !booking) {
            throw new Error("Booking not found");
        }

        if (booking.status === "cancelled") {
            throw new Error("Booking already cancelled");
        }

        // Cancel booking
        const { error:cancelError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", booking_id);

        if (cancelError) throw cancelError;

        //make room available again
        await supabase
        .from("rooms")
        .update({ is_available: true })
        .eq("id", booking.room_id);

        return true;
    }
};