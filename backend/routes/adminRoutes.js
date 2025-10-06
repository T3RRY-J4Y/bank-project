import express from "express";
import { body, validationResult } from "express-validator";
import Payment from "../models/Payment.js";
import { authEmployee } from "../middleware/auth.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    // Replace with real employee lookup & password verification
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Admin token
      const jwt = require("jsonwebtoken");
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
      res.cookie("adminToken", token, { httpOnly: true, secure: true }).json({ message: "Admin logged in successfully" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get all payments (admin view)
router.get("/payments", authEmployee, async (req, res) => {
  try {
    const payments = await Payment.find().populate("userId", "fullName idNumber accountNumber");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
});

// Verify a payment
router.post(
  "/payments/:id/verify",
  authEmployee,
  body("id").isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid payment ID", errors: errors.array() });

    const { id } = req.params;

    try {
      const payment = await Payment.findById(id);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      if (payment.status === "Verified")
        return res.status(400).json({ message: "Payment already verified" });

      payment.status = "Verified";
      await payment.save();

      // Respond with success and updated payment
      res.json({ message: "Payment verified successfully", payment });
    } catch (err) {
      res.status(500).json({ message: "Could not verify payment", error: err.message });
    }
  }
);

export default router;
