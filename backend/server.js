import express from "express";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Security Middlewares 
app.use(helmet());
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later."
}));
app.use(mongoSanitize());
app.use(csurf({ cookie: true }));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

//Connect MongoDB
connectDB();

// HTTPS Setup 
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert")
};

https.createServer(options, app).listen(PORT, () =>
  console.log(`Server running on https://localhost:${PORT}`)
);
