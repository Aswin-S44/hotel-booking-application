import React from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/env";

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/customer/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //   credentials: "include",
          body: JSON.stringify({
            amount: 500,
            currency: "INR",
          }),
        }
      );

      const { id: order_id, amount, currency } = response.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: amount,
        currency: currency,
        name: "Your App Name",
        description: "Test Transaction",
        order_id: order_id,
        handler: (response) => {
          alert(
            `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
          );
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentButton;
