import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import connectDB from "../config/db.js";

dotenv.config();

const ADMIN_USERNAME = "siyabonga";
const ADMIN_PASSWORD = "siyabonga2024"; 

async function seedAdmin() {
  try {
    await connectDB();

    // Remove existing admin with this username
    await Employee.deleteMany({ username: ADMIN_USERNAME });

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create new admin
    const admin = new Employee({
      username: ADMIN_USERNAME,
      passwordHash: hashedPassword,
    });
    await admin.save();

    console.log(`✅ Admin created -> username: ${ADMIN_USERNAME}, password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();
