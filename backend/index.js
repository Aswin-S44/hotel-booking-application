import "./config/env.js";
import db from "./config/db.js";
import express from "express";
import cors from "cors";
import customerRouter from "./routes/customer.js";
import authRouter from "./routes/auth.js";

const app = express();
db();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json());

app.use("/customer", customerRouter)
app.use("/auth", authRouter);
const port = process.env.PORT || 5000; 

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
