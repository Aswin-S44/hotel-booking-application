import razorpayInstance from "../../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: 100,
      currency: currency || "INR",
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
  }
};
