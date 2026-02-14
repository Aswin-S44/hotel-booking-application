import razorpayInstance from "../config/razorpay.js";
import Bookings from "../models/bookings.js";
import Guests from "../models/guests.js";
import Payment from "../models/payments.js";
import Property from "../models/propertySchema.js";

export const createBooking = async (req, res) => {
  try {
    // console.log("createBooking---------------", createBooking);
    const { amount, currency } = req.body;
    const { propertyId, roomId } = req.params;

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
    };

    const shopOwner = await Property.findOne({ _id: propertyId }).select({
      owner: 1,
    });

    if (!shopOwner) {
      return res.status(404).send({ message: "Shop not found" });
    }

    console.log(
      "shopOwner----------------",
      shopOwner ? shopOwner : "no shopOwner"
    );

    // const order = await razorpayInstance.orders.create(options); // Need to undo this

    const paymentData = {
      cardNumber: req.body.cardNumber,
      expirationDate: req.body.expirationDate,
      expirationYear: req.body.expirationYear,
      cvv: req.body.cvv,
      cardName: req.body.cardName,
    };

    const paymentDetails = await Payment.create(paymentData);
    console.log("paymentDetails-------------", paymentDetails);

    if (!paymentDetails) {
      return res.status(400).send({ message: "Payment failed" });
    }

    const bookingData = {
      shopId: shopOwner.owner,
      propertyId,
      roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      totalAmount: req.body.totalAmount,
      paymentStatus: "paid",
      status: "booked",
      paymentId: paymentDetails._id,
    };

    const createdBooking = await Bookings.create(bookingData);

    if (!createdBooking) {
      return res.status(400).send({ message: "Error while create booking" });
    }

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
