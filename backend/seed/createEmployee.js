import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import connectDB from "../config/db.js";

dotenv.config();

async function createEmployee() {
  try {
    await connectDB();

    const username = "siyabonga";
    const password = "T3rry_J4y"; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await Employee.findOne({ username });
    if (existing) {
      console.log("Employee already exists, skipping creation.");
      process.exit(0);
    }

    const employee = new Employee({ username, passwordHash: hashedPassword });
    await employee.save();

    console.log(`Employee created -> username: ${username}, password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating employee:", err.message);
    process.exit(1);
  }
}

createEmployee();
