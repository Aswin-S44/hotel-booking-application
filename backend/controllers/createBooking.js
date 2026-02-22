import razorpayInstance from "../config/razorpay.js";
import Bookings from "../models/bookings.js";
import Guests from "../models/guests.js";
import Payment from "../models/payments.js";
import Property from "../models/propertySchema.js";
import Activity from "../models/activitySchema.js";
import Room from "../models/roomSchema.js";
import Stats from "../models/statsSchema.js";
import crypto from "crypto";

export const createBooking = async (req, res) => {
  try {
    console.log("11111111111111111");
    const {
      currency,
      checkInDate,
      checkOutDate,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentMethod,
      guests,
    } = req.body;

    const { propertyId, roomId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(404).send({ message: "User not loggedin" });
    }

    // Verify Payment Signature if it's an online payment

    if (paymentMethod === "online") {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).send({ message: "Invalid payment signature" });
      }
    }

    const shopOwner = await Property.findOne({ _id: propertyId }).select({
      owner: 1,
    });
    const shopId = shopOwner.owner;
    if (!shopOwner) {
      return res.status(404).send({ message: "Shop not found" });
    }

    const room = await Room.findOne({ _id: roomId, isAvailable: true });
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffInMs = checkOut - checkIn;
    const nights = diffInMs / (1000 * 60 * 60 * 24);
    const earnings = nights * room.price;

    const paymentData = {
      razorpay_payment_id: razorpay_payment_id || "offline",
      razorpay_order_id: razorpay_order_id || "offline",
      amount: earnings,
      method: paymentMethod,
    };

    const paymentDetails = await Payment.create(paymentData);

    const bookingData = {
      shopId: shopOwner.owner,
      propertyId,
      roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      totalAmount: req.body.totalAmount,
      paymentStatus: paymentMethod === "online" ? "paid" : "pay_at_hotel",
      status: "booked",
      paymentId: paymentDetails._id,
      trafficSource: req.body.trafficSource || "organic",
      utm: {
        source: req.body.utm_source,
        medium: req.body.utm_medium,
        campaign: req.body.utm_campaign,
      },
      bookedUserId: userId,
    };

    const createdBooking = await Bookings.create(bookingData);

    // Create activity for property owner
    // await Activity.create({
    //   userId: propertyId, // property owner receives notification
    //   actorId: req.userId ?? null, // user who booked
    //   type: "BOOKING",
    //   title: "New Booking",
    //   description: `${req.user?.name || "Guest"} booked your room at ${
    //     room?.roomName ?? "UNavailable"
    //   }`,
    //   relatedId: createdBooking._id,
    // });

    const stats = await Stats.findOne({ shopId: shopId });
    if (stats) {
      await Stats.updateOne({ shopId }, { $inc: { earnings, visitors: 1 } });
    } else {
      await Stats.create({
        shopId,
        listings: 1,
        earnings,
        visitors: 1,
        reviews: 0,
      });
    }

    if (guests?.length > 0) {
      for (const guest of guests) {
        const guestUserData = {
          propertyId,
          roomId,
          title: guest.title,
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: req.body.email,
          phone: req.body.phone,
          specialRequests: req.body.specialRequests,
          selectedPaymentTypeId: req.body.selectedPaymentTypeId,
          bookingId: createdBooking._id,
        };
        await Guests.create(guestUserData);
      }
    }
    await Room.updateOne({ _id: roomId }, { $set: { isAvailable: false } });
    res.status(200).send({ success: true, message: "Booking created" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
