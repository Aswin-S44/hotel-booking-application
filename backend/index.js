import "./config/env.js";
import express from "express";
import cors from "cors";
import { supabase } from "./config/supabaseClient.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json());

app.use("/api/bookings", bookingRoutes);
const port = process.env.PORT

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend server is running successfully' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
