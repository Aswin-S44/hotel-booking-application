import nodemailer from "nodemailer";

export const sendBookingEmail = async ({
    to,
    hotelName,
    checkIn,
    checkOut,
    price,
    confirmationCode
}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Happifi Stays" <${process.env.NODEMAILER_EMAIL}>`,
        to,
        subject: "Your Booking Confirmation",
        html:`
        <h2>Booking Confirmed 🎉</h2>
        <p><strong>Hotel:</strong> ${hotelName}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Total Price:</strong> ₹${price}</p>
        <p><strong>Booking ID:</strong> ${confirmationCode}</p>
        <hr/>
        <p>Please keep this ID for future reference.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}