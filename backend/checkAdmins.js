import mongoose from "mongoose";
import "dotenv/config";
import Employee from "./models/Employee.js";

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admins = await Employee.find();
    console.log("✅ Found admins:", admins);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

checkAdmins();
