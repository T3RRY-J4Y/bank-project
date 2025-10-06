import express from "express";
import { body, validationResult } from "express-validator";
import Payment from "../models/Payment.js";
import { authCustomer } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authCustomer,
  [
    body("amount").isFloat({ gt: 0 }),
    body("currency").isLength({ min: 3, max: 3 }).isUppercase(),
    body("payeeAccount").matches(/^\d{6,20}$/),
    body("swiftCode").matches(/^[A-Z0-9]{8,11}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { amount, currency, payeeAccount, swiftCode } = req.body;

    try {
      const payment = new Payment({
        userId: req.user.id,
        amount,
        currency,
        payeeAccount,
        swiftCode,
        status: "Pending"
      });
      await payment.save();
      res.status(201).json({ message: "Payment created successfully.", payment });
    } catch (err) {
      res.status(500).json({ message: "Error creating payment.", error: err.message });
    }
  }
);

router.get("/", authCustomer, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments.", error: err.message });
  }
});

export default router;
