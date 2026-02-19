import razorpayInstance from "../config/razorpay.js";
import Bookings from "../models/bookings.js";
import Guests from "../models/guests.js";
import Payment from "../models/payments.js";
import Property from "../models/propertySchema.js";
import Activity from "../models/activitySchema.js";

import Room from "../models/roomSchema.js";
import Stats from "../models/statsSchema.js";

export const createBooking = async (req, res) => {
  try {
    const { currency, checkInDate, checkOutDate } = req.body;
    const { propertyId, roomId } = req.params;

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

    const options = {
      amount: earnings,
      currency: currency || "INR",
    };

    // const order = await razorpayInstance.orders.create(options); // Need to undo this

    const paymentData = {
      cardNumber: req.body.cardNumber,
      expirationDate: req.body.expirationDate,
      expirationYear: req.body.expirationYear,
      cvv: req.body.cvv,
      cardName: req.body.cardName,
      amount: earnings,
    };

    const paymentDetails = await Payment.create(paymentData);

    if (!paymentDetails) {
      return res.status(400).send({ message: "Payment failed" });
    }

    const bookingData = {
  shopId,
  propertyId,
  roomId,
  checkInDate,
  checkOutDate,
  totalAmount: earnings,
  paymentStatus: "paid",
  status: "booked",
  paymentId: paymentDetails._id,
  trafficSource: req.body.trafficSource || "organic",
  utm: {
    source: req.body.utm_source,
    medium: req.body.utm_medium,
    campaign: req.body.utm_campaign,
  },
};


    const createdBooking = await Bookings.create(bookingData);

    // Create activity for property owner
    await Activity.create({
      userId: propertyId, // property owner receives notification
      actorId: req.userId, // user who booked
      type: "BOOKING",
      title: "New Booking",
      description: `${req.user.name} booked your room at ${room.name}`,
      relatedId: createdBooking._id,
    });


    if (!createdBooking) {
      return res.status(400).send({ message: "Error while create booking" });
    }

    const stats = await Stats.findOne({ shopId: req.userId });

    if (stats) {
      await Stats.updateOne(
        { shopId },
        {
          $inc: {
            earnings,
            visitors: 1,
          },
        }
      );
    } else {
      await Stats.create({
        shopId,
        listings: 1,
        earnings,
        visitors: 1,
        reviews: 0,
      });
    }

    await Room.updateOne({ _id: roomId }, { $set: { isAvailable: false } });

    const guestUserData = {
      propertyId,
      roomId,
      title: req.body.title,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      specialRequests: req.body.specialRequests,
      selectedPaymentTypeId: req.body.selectedPaymentTypeId,
      bookingId: createdBooking._id,
    };

    await Guests.create(guestUserData);

    res.status(200).send({ message: "Booking created" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
