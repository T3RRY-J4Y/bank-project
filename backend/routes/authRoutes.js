import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { fullName, idNumber, accountNumber, password } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;
  const idNumberRegex = /^\d{13}$/;
  const accountRegex = /^\d{6,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!nameRegex.test(fullName)) return res.status(400).json({ message: "Invalid full name" });
  if (!idNumberRegex.test(idNumber)) return res.status(400).json({ message: "Invalid ID number" });
  if (!accountRegex.test(accountNumber)) return res.status(400).json({ message: "Invalid account number" });
  if (!passwordRegex.test(password)) return res.status(400).json({ message: "Weak password" });

  try {
    const passwordHash = await hashPassword(password);
    const user = new User({ fullName, idNumber, accountNumber, passwordHash });
    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true }).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

export default router;
