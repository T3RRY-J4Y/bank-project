import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import connectDB from "../config/db.js";

dotenv.config();

async function reseedAdmin() {
  try {
    await connectDB();

    const username = "siyabonga";
    const password = "T3rry_J4y";
    const hashedPassword = await bcrypt.hash(password, 10);

    await Employee.deleteMany({ username }); // Remove old entry
    const employee = new Employee({ username, passwordHash: hashedPassword });
    await employee.save();

    console.log(`✅ Admin seeded -> username: ${username}, password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reseedAdmin();
