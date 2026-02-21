import "./config/env.js";
import db from "./config/db.js";
import express from "express";
import cors from "cors";
import customerRouter from "./routes/customer.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import shopsRouter from "./routes/shops.js";
import seedAdmin from "./seed.js";

const app = express();

// Database connection
db();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/shops", shopsRouter);

const port = process.env.PORT || 5000;

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend server is running successfully" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message });
});

seedAdmin();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
