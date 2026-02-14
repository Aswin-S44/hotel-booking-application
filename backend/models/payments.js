import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    expirationYear: { type: String, required: true },
    cvv: { type: String, required: true },
    cardName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
