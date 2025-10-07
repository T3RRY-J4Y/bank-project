import express from "express";
import Payment from "../models/Payment.js";
import { authCustomer } from "../middleware/auth.js";
import { currencyRegex, swiftRegex, accountRegex } from "../utils/validators.js";

const router = express.Router();

// Create Payment
router.post("/", authCustomer, async (req, res) => {
  try {
    const { amount, currency, payeeAccount, swiftCode } = req.body;

    // Validate input using regex
    if (isNaN(amount) || Number(amount) <= 0) 
      return res.status(400).json({ message: "Amount must be a positive number." });

    if (!currencyRegex.test(currency)) 
      return res.status(400).json({ message: "Currency must be a 3-letter code (e.g., ZAR)." });

    if (!accountRegex.test(payeeAccount)) 
      return res.status(400).json({ message: "Payee account must contain 6–20 digits." });

    if (!swiftRegex.test(swiftCode)) 
      return res.status(400).json({ message: "SWIFT code must be 8–11 letters/numbers." });

    // Create payment
    const payment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      payeeAccount,
      swiftCode,
      status: "Pending" // default status
    });

    await payment.save();
    res.status(201).json({ message: "Payment created successfully.", payment });
  } catch (err) {
    res.status(500).json({ message: "Error creating payment.", error: err.message });
  }
});

// List Payments (customer’s own)
router.get("/", authCustomer, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments.", error: err.message });
  }
});

export default router;
