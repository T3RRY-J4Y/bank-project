import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import Payment from "../models/Payment.js";
import { param } from "express-validator";
import { authEmployee } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Admin login using MongoDB
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const employee = await Employee.findOne({ username });
    if (!employee)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, employee.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res
      .cookie("adminToken", token, { httpOnly: true, secure: false })
      .json({ message: "Admin logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get all payments
router.get("/payments", authEmployee, async (req, res) => {
  try {
    const payments = await Payment.find().populate(
      "userId",
      "fullName idNumber accountNumber"
    );
    res.json(payments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching payments", error: err.message });
  }
});

// ✅ Verify a payment
router.post(
  "/payments/:id/verify",
  authEmployee,
  param("id").isMongoId().withMessage("Invalid payment ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        message: "Invalid payment ID",
        errors: errors.array(),
      });

    const { id } = req.params;

    try {
      const payment = await Payment.findById(id);
      if (!payment)
        return res.status(404).json({ message: "Payment not found" });

      if (payment.status === "Verified")
        return res.status(400).json({ message: "Payment already verified" });

      payment.status = "Verified";
      await payment.save();

      res.json({ message: "✅ Payment verified successfully", payment });
    } catch (err) {
      res
        .status(500)
        .json({ message: "❌ Could not verify payment", error: err.message });
    }
  }
);

export default router;
