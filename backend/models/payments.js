import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    cardNumber: { type: String },
    expirationDate: { type: String },
    expirationYear: { type: String },
    cvv: { type: String },
    cardName: { type: String },
    amount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
